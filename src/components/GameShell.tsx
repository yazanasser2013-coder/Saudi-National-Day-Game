import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, SkipForward } from "lucide-react";
import { useGame } from "../context/game-context";
import { useTimer } from "../hooks/useTimer";
import { useAudio } from "../hooks/useAudio";
import { LandingScreen } from "./LandingScreen";
import { PlayerJoin } from "./PlayerJoin";
import { QuestionCard } from "./QuestionCard";
import { Timer } from "./Timer";
import { ScoreDisplay } from "./ScoreDisplay";
import { PhaseTransition } from "./PhaseTransition";
import { FinalStage } from "./FinalStage";
import { ResultReveal } from "./ResultReveal";
import { Question20Cinematic } from "./Question20Cinematic";
import { SoundControl } from "./SoundControl";
import { PreGameChallenge } from "./PreGameChallenge";
import { Confetti } from "./Confetti";
import { ScorePopup } from "./ScorePopup";
import { StreakBar } from "./StreakBar";
import { GeometricTransition } from "./GeometricTransition";
import { ModeSelect } from "./ModeSelect";
import { SortChallenge } from "./SortChallenge";
import { TrueFalse } from "./TrueFalse";
import { TypingChallenge } from "./TypingChallenge";
import { GameTutorial } from "./GameTutorial";
import { calculateScore } from "../utils/scoring";
import { getLeaderboard, type LeaderboardEntry } from "../utils/leaderboard";

const PERSONALITY_MESSAGES = {
  teacher: ["أهلاً يا أستاذ. 👋\nتقول إن عندك أقوى الطلاب؟\nخلنا نشوف. 👀"],
  fast: ["لحظة...\nكيف جاوبت بهذه السرعة؟! ⚡"],
  excellent: [
    "واضح إن عندنا واحد فاهم.\nلكن لا تتحمس...\nالأسئلة الحقيقية تبدأ الآن.",
  ],
  slow: ["ما شاء الله... خذ وقتك. 😂\nبس تذكر: الساعة ما تنتظر أحد."],
  mistakes: ["يا أستاذ...\nيمكن فعلًا كان اختيارك غلط. 😭"],
  timeout: ["انتهى الوقت.\nالسرعة جزء من اللعبة."],
  halfway: [
    "وصلت للنصف الأخير.\n\nإلى الآن الأمور كانت سهلة...\n\nلكن الآن؟\n☠️ لا ضمانات.",
  ],
  pressure: ["تحتاج أكثر من الحفظ هنا.\n\nفكّر بسرعة.\nعندك 10 ثوانٍ."],
  almost: [
    "باقي سؤالان.\n\nإذا وصلت هنا...\nفأنت من القلة.\n\nلكن القادم؟\nما يرحم.",
  ],
};

export function GameShell() {
  const { state, dispatch, answerQuestion, startGame, exitGame } = useGame();
  const { playWrong, playCorrect } = useAudio();
  const [showResult, setShowResult] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [personalityMessage, setPersonalityMessage] = useState<string | null>(null);
  const [showPersonality, setShowPersonality] = useState(false);
  const [question20Cinematic, setQuestion20Cinematic] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionColor, setTransitionColor] = useState<"emerald" | "gold" | "red">("emerald");
  const [scorePopup, setScorePopup] = useState<{
    points: number;
    isCorrect: boolean;
    responseTime: number;
    isSpeedBonus: boolean;
  } | null>(null);
  const [questionTransition, setQuestionTransition] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingRef = useRef(false);
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, id) => ({
      id,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      width: Math.random() * 4 + 2 + "px",
      height: Math.random() * 4 + 2 + "px",
      animationDelay: Math.random() * 8 + "s",
      animationDuration: 6 + Math.random() * 6 + "s",
      duration: 6 + Math.random() * 6,
    })),
  );

  useEffect(() => () => {
    if (advanceTimerRef.current !== null) {
      clearTimeout(advanceTimerRef.current);
    }
  }, []);

  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isFinalStage = state.phase === 3;
  const isQuestion20 = isFinalStage && state.currentQuestionIndex === 19;

  const multiplier = useMemo(() => {
    if (currentStreak >= 5) return 2.0;
    if (currentStreak >= 3) return 1.5;
    if (currentStreak >= 2) return 1.25;
    return 1;
  }, [currentStreak]);

  const { leaderboardData, finalRank } = useMemo(() => {
    if (state.gameStatus === "results" && state.player) {
      const board = getLeaderboard();
      const playerEntry: LeaderboardEntry = {
        id: "current",
        name: state.player.name,
        mode: state.player.mode,
        teamNames: state.player.teamNames,
        score: state.score,
        correctAnswers: state.correctAnswers,
        totalQuestions: state.questions.length,
        averageTime: state.averageAnswerTime,
        fastestAnswer: state.fastestAnswer === Infinity ? 999 : state.fastestAnswer,
        percentage: Math.round((state.correctAnswers / state.questions.length) * 100),
        date: new Date().toLocaleDateString("ar-SA"),
        timestamp: Date.now(),
        gameMode: state.gameMode,
      };
      const rank = board.findIndex((e) => e.id === playerEntry.id) + 1 || board.length + 1;
      return { leaderboardData: board, finalRank: rank };
    }
    return { leaderboardData: [], finalRank: 1 };
  }, [state.gameStatus, state.player, state.score, state.correctAnswers, state.averageAnswerTime, state.fastestAnswer, state.questions.length]);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  }, []);

  const triggerTransition = useCallback((color: "emerald" | "gold" | "red") => {
    setTransitionColor(color);
    setShowTransition(true);
    setTimeout(() => setShowTransition(false), 800);
  }, []);

  const handleSkip = useCallback(() => {
    if (!state.player?.isOwner || showResult || !currentQuestion) return;
    playCorrect();
    dispatch({ type: "SKIP_QUESTION" });
    setScorePopup({ points: currentQuestion.basePoints, isCorrect: true, responseTime: 0, isSpeedBonus: false });
    setTimeout(() => setScorePopup(null), 1200);
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      isProcessingRef.current = false;
      setShowResult(false);
      setSelectedIndex(null);
      setShowPersonality(false);
      setPersonalityMessage(null);
      setQuestionTransition(true);
      setTimeout(() => setQuestionTransition(false), 400);
      if (state.currentQuestionIndex === 9 && state.phase === 2) {
        triggerTransition("red");
        dispatch({ type: "PHASE_TRANSITION" });
      } else if (isQuestion20 && !question20Cinematic) {
        setQuestion20Cinematic(true);
      } else {
        dispatch({ type: "NEXT_QUESTION" });
      }
    }, 800);
  }, [state.player?.isOwner, state.currentQuestionIndex, state.phase, showResult, currentQuestion, dispatch, playCorrect, triggerTransition, isQuestion20, question20Cinematic]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (isProcessingRef.current || showResult || !currentQuestion || advanceTimerRef.current !== null || state.answeredQuestions.some((q) => q.id === currentQuestion.id)) return;
      isProcessingRef.current = true;
      setSelectedIndex(index);
      setShowResult(true);
      answerQuestion(index);

      const responseTime = (Date.now() - state.questionStartedAt) / 1000;
      const correct = index === currentQuestion.correctAnswer;

      if (correct) {
        playCorrect();
        const pts = calculateScore(currentQuestion.basePoints, responseTime, currentQuestion.timeLimit);
        const isSpeedBonus = responseTime < 3;
        setScorePopup({ points: pts, isCorrect: true, responseTime, isSpeedBonus });
        setTimeout(() => setScorePopup(null), 1500);

        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);

        if (newStreak >= 3) triggerConfetti();
        if (newStreak === 5) {
          triggerConfetti();
          triggerTransition("gold");
        }

        if (responseTime < 2) {
          setPersonalityMessage(PERSONALITY_MESSAGES.fast[0]);
          setShowPersonality(true);
        } else if (state.correctAnswers >= 8 && state.currentQuestionIndex < 10) {
          setPersonalityMessage(PERSONALITY_MESSAGES.excellent[0]);
          setShowPersonality(true);
        }
      } else {
        playWrong();
        setCurrentStreak(0);
        if (state.wrongAnswers >= 3) {
          setPersonalityMessage(PERSONALITY_MESSAGES.mistakes[0]);
          setShowPersonality(true);
        }
      }

      if (responseTime > 10 && correct) {
        setPersonalityMessage(PERSONALITY_MESSAGES.slow[0]);
        setShowPersonality(true);
      }
      if (state.currentQuestionIndex === 9 && state.phase === 2) {
        setPersonalityMessage(PERSONALITY_MESSAGES.halfway[0]);
        setShowPersonality(true);
      }

      advanceTimerRef.current = setTimeout(() => {
        advanceTimerRef.current = null;
        isProcessingRef.current = false;
        setShowResult(false);
        setSelectedIndex(null);
        setShowPersonality(false);
        setPersonalityMessage(null);
        setQuestionTransition(true);
        setTimeout(() => setQuestionTransition(false), 400);
        if (state.currentQuestionIndex === 9 && state.phase === 2) {
          triggerTransition("red");
          dispatch({ type: "PHASE_TRANSITION" });
        } else if (isQuestion20 && !question20Cinematic) {
          setQuestion20Cinematic(true);
        } else {
          dispatch({ type: "NEXT_QUESTION" });
        }
      }, correct ? 1000 : 1500);
    },
    [answerQuestion, currentQuestion, showResult, state.questionStartedAt, state.answeredQuestions, state.correctAnswers, state.currentQuestionIndex, state.phase, state.wrongAnswers, dispatch, isQuestion20, question20Cinematic, currentStreak, triggerConfetti, triggerTransition, playCorrect, playWrong],
  );

  useTimer(() => {
    if (showResult || advanceTimerRef.current !== null) return;
    setShowResult(true);
    setCurrentStreak(0);
    setPersonalityMessage(PERSONALITY_MESSAGES.timeout[0]);
    setShowPersonality(true);
    playWrong();
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      isProcessingRef.current = false;
      setShowResult(false);
      setSelectedIndex(null);
      setShowPersonality(false);
      setPersonalityMessage(null);
      setQuestionTransition(true);
      setTimeout(() => setQuestionTransition(false), 400);
      if (state.currentQuestionIndex === 9 && state.phase === 2) {
        triggerTransition("red");
        dispatch({ type: "PHASE_TRANSITION" });
      } else if (isQuestion20 && !question20Cinematic) {
        setQuestion20Cinematic(true);
      } else {
        dispatch({ type: "NEXT_QUESTION" });
      }
    }, 1500);
  });

  const responseTime = state.responseTimes.at(-1);
  const speedBonus =
    responseTime !== undefined && selectedIndex !== null && currentQuestion && showResult && selectedIndex === currentQuestion.correctAnswer
      ? calculateScore(currentQuestion.basePoints, responseTime, currentQuestion.timeLimit) - currentQuestion.basePoints
      : 0;

  if (state.gameStatus === "landing") return <LandingScreen />;
  if (state.gameStatus === "join") return <PlayerJoin />;
  if (state.gameStatus === "mode-select") return <ModeSelect />;
  if (state.gameStatus === "tutorial")
    return (
      <GameTutorial
        gameMode={state.gameMode}
        onBack={() => dispatch({ type: "GO_TO_MODE_SELECT" })}
        onStart={() => {
          if (state.gameMode === "quiz") {
            dispatch({ type: "START_GAME" });
          } else {
            dispatch({ type: "START_GAME" });
          }
        }}
      />
    );
  if (state.gameStatus === "ready")
    return <PreGameChallenge playerName={state.player?.name || "لاعب"} onComplete={startGame} />;
  if (state.gameStatus === "phase-transition")
    return (
      <PhaseTransition
        onComplete={() => {
          dispatch({ type: "ENTER_FINAL_STAGE" });
          dispatch({ type: "NEXT_QUESTION" });
        }}
      />
    );
  if (question20Cinematic)
    return (
      <Question20Cinematic
        onComplete={() => {
          setQuestion20Cinematic(false);
          dispatch({ type: "NEXT_QUESTION" });
        }}
      />
    );
  if (state.gameStatus === "results")
    return (
      <>
        <ResultReveal rank={finalRank} leaderboard={leaderboardData} onRestart={startGame} />
        <SoundControl />
      </>
    );

  if (state.gameStatus === "playing" && state.gameMode === "sort-challenge") return <SortChallenge />;
  if (state.gameStatus === "playing" && state.gameMode === "true-false") return <TrueFalse />;
  if (state.gameStatus === "playing" && state.gameMode === "typing-challenge") return <TypingChallenge />;

  return (
    <div className="app min-h-screen relative">
      <GeometricTransition active={showTransition} color={transitionColor} />
      <Confetti active={showConfetti} count={60} />
      <ScorePopup points={scorePopup?.points ?? 0} isCorrect={scorePopup?.isCorrect ?? false} responseTime={scorePopup?.responseTime ?? 0} isSpeedBonus={scorePopup?.isSpeedBonus ?? false} />
      <StreakBar streak={currentStreak} />

      <motion.button
        onClick={exitGame}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-saudi-red/20 border border-saudi-red/40 text-saudi-red font-bold text-sm hover:bg-saudi-red/30 transition-all duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <LogOut className="w-4 h-4" />
        خروج
      </motion.button>

      {state.player?.isOwner && (
        <motion.button
          onClick={handleSkip}
          disabled={showResult}
          className="fixed top-4 left-28 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-sm hover:bg-amber-500/30 transition-all duration-200 disabled:opacity-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SkipForward className="w-4 h-4" />
          تخطي
        </motion.button>
      )}

      <div className="absolute inset-0 pointer-events-none opacity-10">
        {particles.map(({ id, duration, ...style }) => (
          <motion.div key={id} className="particle" style={style} animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration, repeat: Infinity, ease: "easeInOut" }} />
        ))}
      </div>
      <header className="relative z-10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <ScoreDisplay
            score={state.score}
            correctAnswers={state.correctAnswers}
            currentQuestion={state.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
            phase={state.phase}
            speedBonus={speedBonus}
            streak={currentStreak}
            multiplier={multiplier}
          />
        </div>
      </header>
      <main className="relative z-10 p-4 md:p-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {currentQuestion && !questionTransition && (
              <motion.div key={currentQuestion.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                <QuestionCard
                  question={{ id: currentQuestion.id, question: currentQuestion.question, answers: currentQuestion.answers }}
                  selectedIndex={selectedIndex}
                  correctIndex={showResult ? currentQuestion.correctAnswer : null}
                  showResult={showResult}
                  disabled={showResult}
                  onAnswer={handleAnswer}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-24 md:translate-x-0 z-20">
        <Timer timeRemaining={state.timeRemaining} timeLimit={currentQuestion?.timeLimit || 15} phase={state.phase} />
      </div>
      {isFinalStage && !question20Cinematic && (
        <FinalStage currentQuestion={state.currentQuestionIndex + 1} totalQuestions={state.questions.length} answeredQuestions={state.answeredQuestions.map((q, i) => ({ id: q.id, correct: i < state.correctAnswers }))} />
      )}
      <AnimatePresence>
        {showPersonality && personalityMessage && (
          <motion.div
            key="personality"
            className="fixed bottom-24 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-40 md:translate-x-0 max-w-xs z-30"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-saudi-black/90 border border-saudi-emerald/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,166,81,0.2)]">
              <p className="text-saudi-white/90 text-sm leading-relaxed whitespace-pre-line">{personalityMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <SoundControl />
    </div>
  );
}
