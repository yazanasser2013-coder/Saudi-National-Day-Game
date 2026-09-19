import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { calculateScore } from "../utils/scoring";

const PERSONALITY_MESSAGES = {
  teacher: ["أهلًا يا أستاذ. 👋\\nتقول إن عندك أقوى الطلاب؟\\nخلنا نشوف. 👀"],
  fast: ["لحظة...\\nكيف جاوبت بهذه السرعة؟! ⚡"],
  excellent: [
    "واضح إن عندنا واحد فاهم.\\nلكن لا تتحمس...\\nالأسئلة الحقيقية تبدأ الآن.",
  ],
  slow: ["ما شاء الله... خذ وقتك. 😂\\nبس تذكر: الساعة ما تنتظر أحد."],
  mistakes: ["يا أستاذ...\\nيمكن فعلًا كان اختيارك غلط. 😭"],
  timeout: ["انتهى الوقت.\\nالسرعة جزء من اللعبة."],
  halfway: [
    "وصلت للنصف الأخير.\\n\\nإلى الآن الأمور كانت سهلة...\\n\\nلكن الآن؟\\n☠️ لا ضمانات.",
  ],
  pressure: ["تحتاج أكثر من الحفظ هنا.\\n\\nفكّر بسرعة.\\nعندك 10 ثوانٍ."],
  almost: [
    "باقي سؤالان.\\n\\nإذا وصلت هنا...\\nفأنت من القلة.\\n\\nلكن القادم؟\\nما يرحم.",
  ],
};

export function GameShell() {
  const { state, dispatch, answerQuestion, startGame, resetGame } = useGame();
  const { playClick, playWrong } = useAudio();
  const [showResult, setShowResult] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [personalityMessage, setPersonalityMessage] = useState<string | null>(
    null,
  );
  const [showPersonality, setShowPersonality] = useState(false);
  const [question20Cinematic, setQuestion20Cinematic] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  const { leaderboardData, finalRank } = useMemo(() => {
    if (state.gameStatus === "results" && state.player) {
      const mockLeaderboard = [
        { name: "Yazan", score: 18742, correctAnswers: 16, averageTime: 4.21 },
        {
          name: "Mohammed",
          score: 17931,
          correctAnswers: 15,
          averageTime: 4.45,
        },
        { name: "Sarah", score: 17204, correctAnswers: 15, averageTime: 4.67 },
        {
          name: "Abdullah",
          score: 16820,
          correctAnswers: 14,
          averageTime: 5.12,
        },
        { name: "Faisal", score: 16403, correctAnswers: 14, averageTime: 5.33 },
        { name: "Ahmed", score: 15900, correctAnswers: 13, averageTime: 5.89 },
        { name: "Khalid", score: 15200, correctAnswers: 13, averageTime: 6.01 },
        { name: "Omar", score: 14800, correctAnswers: 12, averageTime: 6.45 },
        { name: "Ali", score: 14200, correctAnswers: 12, averageTime: 6.78 },
        { name: "Hassan", score: 13800, correctAnswers: 11, averageTime: 7.12 },
      ];
      const playerEntry = {
        name: state.player.name,
        score: state.score,
        correctAnswers: state.correctAnswers,
        averageTime: state.averageAnswerTime,
      };
      const allEntries = [...mockLeaderboard, playerEntry].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.correctAnswers !== a.correctAnswers)
          return b.correctAnswers - a.correctAnswers;
        return a.averageTime - b.averageTime;
      });
      return {
        leaderboardData: allEntries,
        finalRank: allEntries.indexOf(playerEntry) + 1,
      };
    }
    return { leaderboardData: [], finalRank: 1 };
  }, [
    state.gameStatus,
    state.player,
    state.score,
    state.correctAnswers,
    state.averageAnswerTime,
  ]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (
        showResult ||
        !currentQuestion ||
        advanceTimerRef.current !== null ||
        state.answeredQuestions.some((question) => question.id === currentQuestion.id)
      ) return;
      setSelectedIndex(index);
      setShowResult(true);
      answerQuestion(index);
      const responseTime = (Date.now() - state.questionStartedAt) / 1000;
      const correct = index === currentQuestion.correctAnswer;
      if (correct && responseTime < 2) {
        setPersonalityMessage(PERSONALITY_MESSAGES.fast[0]);
        setShowPersonality(true);
      } else if (
        correct &&
        state.correctAnswers >= 8 &&
        state.currentQuestionIndex < 10
      ) {
        setPersonalityMessage(PERSONALITY_MESSAGES.excellent[0]);
        setShowPersonality(true);
      } else if (!correct && state.wrongAnswers >= 3) {
        setPersonalityMessage(PERSONALITY_MESSAGES.mistakes[0]);
        setShowPersonality(true);
      } else if (responseTime > 10) {
        setPersonalityMessage(PERSONALITY_MESSAGES.slow[0]);
        setShowPersonality(true);
      }
      advanceTimerRef.current = setTimeout(
        () => {
          advanceTimerRef.current = null;
          setShowResult(false);
          setSelectedIndex(null);
          setShowPersonality(false);
          setPersonalityMessage(null);
          if (state.currentQuestionIndex === 9 && state.phase === 2) {
            dispatch({ type: "PHASE_TRANSITION" });
          } else if (isQuestion20 && !question20Cinematic) {
            setQuestion20Cinematic(true);
          } else {
            dispatch({ type: "NEXT_QUESTION" });
          }
        },
        correct ? 1000 : 1500,
      );
    },
    [
      answerQuestion,
      currentQuestion,
      showResult,
      state.questionStartedAt,
      state.answeredQuestions,
      state.correctAnswers,
      state.currentQuestionIndex,
      state.phase,
      state.wrongAnswers,
      dispatch,
      isQuestion20,
      question20Cinematic,
    ],
  );

  useTimer(() => {
    if (showResult || advanceTimerRef.current !== null) return;
    setShowResult(true);
    setPersonalityMessage(PERSONALITY_MESSAGES.timeout[0]);
    setShowPersonality(true);
    playWrong();
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      setShowResult(false);
      setSelectedIndex(null);
      setShowPersonality(false);
      setPersonalityMessage(null);
      if (state.currentQuestionIndex === 9 && state.phase === 2) {
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
    responseTime !== undefined &&
    selectedIndex !== null &&
    currentQuestion &&
    showResult &&
    selectedIndex === currentQuestion.correctAnswer
      ? calculateScore(
          currentQuestion.basePoints,
          responseTime,
          currentQuestion.timeLimit,
        ) - currentQuestion.basePoints
      : 0;

  if (state.gameStatus === "landing") return <LandingScreen />;
  if (state.gameStatus === "join") return <PlayerJoin />;
  if (state.gameStatus === "ready")
    return (
      <motion.div
        className="app min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1 className="text-4xl md:text-5xl font-bold mb-4">
            مستعد؟
          </motion.h1>
          <motion.p className="text-saudi-white/60 mb-8">
            {state.player?.name}
          </motion.p>
          <motion.button
            onClick={startGame}
            onMouseEnter={playClick}
            className="px-10 py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-full"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            ابدأ الآن
          </motion.button>
        </motion.div>
      </motion.div>
    );

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
        <ResultReveal
          rank={finalRank}
          leaderboard={leaderboardData}
          onRestart={resetGame}
        />
        <SoundControl />
      </>
    );

  return (
    <div className="app min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {particles.map(({ id, duration, ...style }) => (
          <motion.div
            key={id}
            className="particle"
            style={style}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <header className="relative z-10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <ScoreDisplay
            score={state.score}
            correctAnswers={state.correctAnswers}
            currentQuestion={state.currentQuestionIndex + 1}
            totalQuestions={state.questions.length}
            phase={state.phase}
            speedBonus={speedBonus}
          />
        </div>
      </header>
      <main className="relative z-10 p-4 md:p-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {currentQuestion && (
            <QuestionCard
              question={{
                id: currentQuestion.id,
                question: currentQuestion.question,
                answers: currentQuestion.answers,
              }}
              selectedIndex={selectedIndex}
              correctIndex={showResult ? currentQuestion.correctAnswer : null}
              showResult={showResult}
              disabled={showResult}
              onAnswer={handleAnswer}
            />
          )}
        </div>
      </main>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-24 md:translate-x-0 z-20">
        <Timer
          timeRemaining={state.timeRemaining}
          timeLimit={currentQuestion?.timeLimit || 15}
          phase={state.phase}
        />
      </div>
      {isFinalStage && !question20Cinematic && (
        <FinalStage
          currentQuestion={state.currentQuestionIndex + 1}
          totalQuestions={state.questions.length}
          answeredQuestions={state.answeredQuestions.map((q, i) => ({
            id: q.id,
            correct: i < state.correctAnswers,
          }))}
        />
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
            <motion.div
              className="bg-saudi-black/90 border border-saudi-emerald/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,166,81,0.2)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-saudi-white/90 text-sm leading-relaxed whitespace-pre-line">
                {personalityMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SoundControl />
    </div>
  );
}
