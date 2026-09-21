import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, Clock } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import { getShuffledTrueFalse } from "../data/mini-game-questions";
import { Confetti } from "./Confetti";
import { ScorePopup } from "./ScorePopup";
import { SoundControl } from "./SoundControl";

const QUESTION_COUNT = 15;
const TIME_PER_QUESTION = 10;

export function TrueFalse() {
  const { dispatch } = useGame();
  const { playClick, playCorrect, playWrong } = useAudio();
  const [questions] = useState(() => getShuffledTrueFalse(QUESTION_COUNT));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
  }, [isFinished, currentIndex]);

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished && !showResult) {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleTimeout = useCallback(() => {
    if (isProcessing) return;
    setIsProcessing(true);
    setShowResult(true);
    setStreak(0);
    setScorePopup({ points: 0, isCorrect: false });
    setTimeout(() => setScorePopup(null), 1200);

    advanceRef.current = setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      setIsProcessing(false);
      setCurrentIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
      questionStartRef.current = Date.now();
    }, 1200);
  }, [isProcessing]);

  const handleAnswer = useCallback((answer: boolean) => {
    if (isProcessing || showResult || !currentQuestion) return;
    setIsProcessing(true);
    setSelectedAnswer(answer);
    setShowResult(true);

    const responseTime = (Date.now() - questionStartRef.current) / 1000;
    const correct = answer === currentQuestion.isTrue;
    const pts = correct ? Math.round(currentQuestion.basePoints * Math.max(0.5, 1 - responseTime / TIME_PER_QUESTION)) : 0;

    if (correct) {
      playCorrect();
      setScore((s) => s + pts);
      setCorrectCount((c) => c + 1);
      setStreak((s) => s + 1);
      setScorePopup({ points: pts, isCorrect: true });
      if (streak >= 2) setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    } else {
      playWrong();
      setStreak(0);
      setScorePopup({ points: 0, isCorrect: false });
    }
    setTimeout(() => setScorePopup(null), 1200);

    advanceRef.current = setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      setIsProcessing(false);
      setCurrentIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
      questionStartRef.current = Date.now();
    }, correct ? 800 : 1200);
  }, [currentQuestion, isProcessing, showResult, streak, playCorrect, playWrong]);

  useEffect(() => {
    return () => { if (advanceRef.current) clearTimeout(advanceRef.current); };
  }, []);

  if (isFinished) {
    return (
      <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-saudi-red/10 to-saudi-black" />
        <Confetti active={correctCount >= 10} count={40} />
        <motion.div
          className="relative z-10 text-center max-w-lg px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-saudi-red to-amber-500 flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Check className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-saudi-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            انتهى التحدي!
          </motion.h2>

          <motion.div
            className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-2xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-5xl font-bold text-saudi-emerald mb-2">{score.toLocaleString("ar-SA")}</div>
            <div className="text-saudi-white/60">نقاط</div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-saudi-white">{correctCount}</div>
                <div className="text-saudi-white/50 text-sm">صحيحة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-saudi-white">{QUESTION_COUNT - correctCount}</div>
                <div className="text-saudi-white/50 text-sm">خاطئة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{Math.round((correctCount / QUESTION_COUNT) * 100)}%</div>
                <div className="text-saudi-white/50 text-sm">الدقة</div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3">
            <motion.button
              onClick={() => { playClick(); dispatch({ type: "RESET_GAME" }); }}
              className="w-full py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-xl hover:bg-saudi-emerald/90 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              العب مرة أخرى
            </motion.button>
            <motion.button
              onClick={() => { playClick(); dispatch({ type: "GO_TO_MODE_SELECT" }); }}
              className="w-full py-3 border border-saudi-emerald/30 text-saudi-emerald font-bold rounded-xl hover:bg-saudi-emerald/10 transition-colors"
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
    <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-red/10 to-saudi-black" />
      <Confetti active={showConfetti} count={30} />

      {/* Timer */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-saudi-black/50">
        <motion.div
          className="h-full bg-gradient-to-r from-saudi-emerald to-saudi-red"
          animate={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-saudi-red/20 border border-saudi-red/40 rounded-xl">
              <Trophy className="w-5 h-5 text-saudi-red" />
              <span className="text-saudi-red font-bold text-lg">{score.toLocaleString("ar-SA")}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl">
              <span className="text-saudi-emerald font-bold text-sm">{correctCount}/{currentIndex}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-saudi-black/50 border border-saudi-white/10 rounded-xl">
            <Clock className="w-4 h-4 text-saudi-white/60" />
            <span className={`font-bold text-lg font-mono ${timeLeft < 4 ? "text-saudi-red animate-pulse" : "text-saudi-white"}`}>
              {Math.ceil(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-10">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              animate={{
                width: i === currentIndex ? 20 : 6,
                backgroundColor: i < currentIndex ? "#0B8C38" : i === currentIndex ? "#D94A11" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

        {/* Statement */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-block px-4 py-1.5 bg-saudi-red/20 border border-saudi-red/30 rounded-full text-sm font-bold text-saudi-red mb-6">
                سؤال {currentIndex + 1} من {QUESTION_COUNT}
              </span>

              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-saudi-white leading-relaxed mb-10 px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentQuestion.statement}
              </motion.h2>

              <div className="flex items-center justify-center gap-6">
                <motion.button
                  onClick={() => handleAnswer(true)}
                  disabled={showResult}
                  className={`group relative flex flex-col items-center gap-3 px-10 py-8 rounded-2xl border-2 transition-all duration-300 ${
                    showResult && currentQuestion.isTrue
                      ? "bg-saudi-emerald/20 border-saudi-emerald shadow-[0_0_30px_rgba(11,140,56,0.3)]"
                      : showResult && selectedAnswer === true && !currentQuestion.isTrue
                        ? "bg-saudi-red/20 border-saudi-red shadow-[0_0_30px_rgba(217,74,17,0.3)]"
                        : "bg-saudi-green/10 border-saudi-emerald/30 hover:border-saudi-emerald/60 hover:bg-saudi-green/20"
                  }`}
                  whileHover={!showResult ? { scale: 1.05, y: -5 } : {}}
                  whileTap={!showResult ? { scale: 0.95 } : {}}
                >
                  <div className="w-16 h-16 rounded-full bg-saudi-emerald/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-saudi-emerald" />
                  </div>
                  <span className="text-xl font-bold text-saudi-white">صح</span>
                </motion.button>

                <motion.button
                  onClick={() => handleAnswer(false)}
                  disabled={showResult}
                  className={`group relative flex flex-col items-center gap-3 px-10 py-8 rounded-2xl border-2 transition-all duration-300 ${
                    showResult && !currentQuestion.isTrue
                      ? "bg-saudi-emerald/20 border-saudi-emerald shadow-[0_0_30px_rgba(11,140,56,0.3)]"
                      : showResult && selectedAnswer === false && currentQuestion.isTrue
                        ? "bg-saudi-red/20 border-saudi-red shadow-[0_0_30px_rgba(217,74,17,0.3)]"
                        : "bg-saudi-red/10 border-saudi-red/30 hover:border-saudi-red/60 hover:bg-saudi-red/20"
                  }`}
                  whileHover={!showResult ? { scale: 1.05, y: -5 } : {}}
                  whileTap={!showResult ? { scale: 0.95 } : {}}
                >
                  <div className="w-16 h-16 rounded-full bg-saudi-red/20 flex items-center justify-center">
                    <X className="w-8 h-8 text-saudi-red" />
                  </div>
                  <span className="text-xl font-bold text-saudi-white">خطأ</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScorePopup points={scorePopup?.points ?? 0} isCorrect={scorePopup?.isCorrect ?? false} responseTime={0} isSpeedBonus={false} />
      <SoundControl />
    </div>
  );
}
