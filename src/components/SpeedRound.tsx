import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Clock, ArrowLeft } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import { getShuffledPhase1, getShuffledPhase2 } from "../data/questions";
import { calculateScore, formatScore } from "../utils/scoring";
import { AnswerCard } from "./AnswerCard";
import { Confetti } from "./Confetti";
import { ScorePopup } from "./ScorePopup";
import { SoundControl } from "./SoundControl";

const TOTAL_TIME = 30;
const QUESTION_COUNT = 10;

export function SpeedRound() {
  const { dispatch } = useGame();
  const { playClick, playCorrect, playWrong } = useAudio();
  const [questions] = useState(() => {
    const p1 = getShuffledPhase1().slice(0, 5);
    const p2 = getShuffledPhase2().slice(0, 5);
    return [...p1, ...p2].sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scorePopup, setScorePopup] = useState<{ points: number; isCorrect: boolean } | null>(null);
  const [streak, setStreak] = useState(0);
  const questionStartRef = useRef(Date.now());
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= QUESTION_COUNT || timeLeft <= 0;

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isFinished]);

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
      finishGame();
    }
  }, [timeLeft]);

  const finishGame = useCallback(() => {
    dispatch({ type: "END_GAME" });
  }, [dispatch]);

  const handleAnswer = useCallback((index: number) => {
    if (isProcessing || showResult || !currentQuestion) return;
    setIsProcessing(true);
    setSelectedIndex(index);
    setShowResult(true);

    const responseTime = (Date.now() - questionStartRef.current) / 1000;
    const correct = index === currentQuestion.correctAnswer;
    const pts = correct ? calculateScore(currentQuestion.basePoints, responseTime, currentQuestion.timeLimit) : 0;

    if (correct) {
      playCorrect();
      setScore((s) => s + pts);
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
      setScorePopup({ points: pts, isCorrect: true });
    } else {
      playWrong();
      setStreak(0);
      setScorePopup({ points: 0, isCorrect: false });
    }
    setTimeout(() => setScorePopup(null), 1200);

    advanceRef.current = setTimeout(() => {
      setShowResult(false);
      setSelectedIndex(null);
      setIsProcessing(false);
      setCurrentIndex((i) => i + 1);
      questionStartRef.current = Date.now();
    }, correct ? 800 : 1000);
  }, [currentQuestion, isProcessing, showResult, streak, playCorrect, playWrong]);

  useEffect(() => {
    return () => { if (advanceRef.current) clearTimeout(advanceRef.current); };
  }, []);

  if (isFinished) {
    return (
      <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-saudi-black" />
        <Confetti active={correctCount >= 7} count={40} />
        <motion.div
          className="relative z-10 text-center max-w-lg px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-saudi-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            انتهى الوقت!
          </motion.h2>

          <motion.div
            className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div
              className="text-5xl font-bold text-saudi-emerald mb-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            >
              {formatScore(score)}
            </motion.div>
            <motion.div
              className="text-saudi-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >نقاط</motion.div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                <div className="text-2xl font-bold text-saudi-white">{correctCount}</div>
                <div className="text-saudi-white/50 text-sm">صحيحة</div>
              </motion.div>
              <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                <div className="text-2xl font-bold text-saudi-white">{QUESTION_COUNT - correctCount}</div>
                <div className="text-saudi-white/50 text-sm">خاطئة</div>
              </motion.div>
              <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                <div className="text-2xl font-bold text-amber-400">{Math.round((correctCount / QUESTION_COUNT) * 100)}%</div>
                <div className="text-saudi-white/50 text-sm">الدقة</div>
              </motion.div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={() => { playClick(); dispatch({ type: "RESET_GAME" }); }}
              className="w-full py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-xl hover:bg-saudi-emerald/90 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              العب مرة أخرى
            </motion.button>
            <motion.button
              onClick={() => { playClick(); dispatch({ type: "GO_TO_MODE_SELECT" }); }}
              className="w-full py-3 border border-saudi-emerald/30 text-saudi-emerald font-bold rounded-xl hover:bg-saudi-emerald/10 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              تغيير التحدي
            </motion.button>
          </div>
        </motion.div>
        <SoundControl />
      </div>
    );
  }

  return (
    <div className="app min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-saudi-black" />

      {/* Back Button */}
      <motion.button
        onClick={() => { playClick(); dispatch({ type: "GO_TO_MODE_SELECT" }); }}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-saudi-red/20 border border-saudi-red/40 text-saudi-red font-bold text-sm hover:bg-saudi-red/30 transition-all duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
        خروج
      </motion.button>

      {/* Global Timer Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-saudi-black/50">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-red-500"
          animate={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="relative z-10 p-4 md:p-6 pt-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/40 rounded-xl">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-bold text-lg">{score.toLocaleString("ar-SA")}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl">
              <Trophy className="w-4 h-4 text-saudi-emerald" />
              <span className="text-saudi-emerald font-bold text-sm">{correctCount}/{currentIndex}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-saudi-red/20 border border-saudi-red/40 rounded-xl">
            <Clock className="w-5 h-5 text-saudi-red" />
            <span className={`font-bold text-lg font-mono ${timeLeft < 10 ? "text-saudi-red animate-pulse" : "text-saudi-white"}`}>
              {Math.ceil(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 mb-8">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              animate={{
                width: i === currentIndex ? 24 : 8,
                backgroundColor: i < currentIndex ? "#0B8C38" : i === currentIndex ? "#c9a227" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Question */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <motion.span
                    className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm font-bold text-amber-400"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    سؤال {currentIndex + 1} / {QUESTION_COUNT}
                  </motion.span>
                  <motion.h2
                    className="text-2xl md:text-3xl font-bold text-saudi-white mt-4 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {currentQuestion.question}
                  </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.answers.map((answer, index) => (
                    <AnswerCard
                      key={index}
                      index={index}
                      text={answer}
                      isSelected={selectedIndex === index}
                      isCorrect={showResult && index === currentQuestion.correctAnswer}
                      isWrong={showResult && selectedIndex === index && index !== currentQuestion.correctAnswer}
                      showResult={showResult}
                      disabled={showResult}
                      onClick={() => handleAnswer(index)}
                      delay={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ScorePopup points={scorePopup?.points ?? 0} isCorrect={scorePopup?.isCorrect ?? false} responseTime={0} isSpeedBonus={false} />
      <SoundControl />
    </div>
  );
}
