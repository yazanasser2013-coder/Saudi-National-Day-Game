import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListOrdered, Trophy, Clock, Check, X, ArrowLeft, GripVertical } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import { getShuffledSort } from "../data/mini-game-questions";
import { formatScore } from "../utils/scoring";
import { Confetti } from "./Confetti";
import { ScorePopup } from "./ScorePopup";
import { SoundControl } from "./SoundControl";

const QUESTION_COUNT = 10;
const TIME_PER_QUESTION = 20;

export function SortChallenge() {
  const { dispatch } = useGame();
  const { playClick, playCorrect, playWrong } = useAudio();
  const [questions] = useState(() => getShuffledSort(QUESTION_COUNT));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scorePopup, setScorePopup] = useState<{ points: number; isCorrect: boolean } | null>(null);
  const [streak, setStreak] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);
  const questionStartRef = useRef(Date.now());
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const isFinished = currentIndex >= QUESTION_COUNT || timeLeft <= 0;

  const shuffledItems = useState(() => {
    return questions.map((q) => {
      const indices = q.items.map((_, i) => i);
      return indices.sort(() => Math.random() - 0.5);
    });
  })[0];

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
    setWasCorrect(false);
    setStreak(0);
    setScorePopup({ points: 0, isCorrect: false });
    setTimeout(() => setScorePopup(null), 1200);

    advanceRef.current = setTimeout(() => {
      setShowResult(false);
      setSelectedOrder([]);
      setIsProcessing(false);
      setCurrentIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
      questionStartRef.current = Date.now();
    }, 1500);
  }, [isProcessing]);

  const handleItemClick = useCallback((itemIndex: number) => {
    if (isProcessing || showResult) return;
    playClick();
    setSelectedOrder((prev) => {
      if (prev.includes(itemIndex)) {
        return prev.filter((i) => i !== itemIndex);
      }
      return [...prev, itemIndex];
    });
  }, [isProcessing, showResult, playClick]);

  const handleSubmit = useCallback(() => {
    if (isProcessing || showResult || !currentQuestion || selectedOrder.length !== currentQuestion.items.length) return;
    setIsProcessing(true);
    setShowResult(true);

    const correct = JSON.stringify(selectedOrder) === JSON.stringify(currentQuestion.correctOrder);
    const responseTime = (Date.now() - questionStartRef.current) / 1000;
    const pts = correct ? Math.round(currentQuestion.basePoints * Math.max(0.5, 1 - responseTime / TIME_PER_QUESTION)) : 0;

    setWasCorrect(correct);

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
      setSelectedOrder([]);
      setIsProcessing(false);
      setCurrentIndex((i) => i + 1);
      setTimeLeft(TIME_PER_QUESTION);
      questionStartRef.current = Date.now();
    }, correct ? 1200 : 2000);
  }, [currentQuestion, selectedOrder, isProcessing, showResult, streak, playCorrect, playWrong]);

  useEffect(() => {
    return () => { if (advanceRef.current) clearTimeout(advanceRef.current); };
  }, []);

  if (isFinished) {
    return (
      <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-saudi-emerald/10 to-saudi-black" />
        <Confetti active={correctCount >= 7} count={40} />
        <motion.div
          className="relative z-10 text-center max-w-lg px-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-saudi-emerald to-saudi-gold flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <ListOrdered className="w-12 h-12 text-white" />
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
    <motion.div
      className="app min-h-screen flex items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-emerald/10 to-saudi-black" />
      <Confetti active={showConfetti} count={30} />

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

      {/* Timer */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-saudi-black/50">
        <motion.div
          className="h-full bg-gradient-to-r from-saudi-emerald to-saudi-gold"
          animate={{ width: `${(timeLeft / TIME_PER_QUESTION) * 100}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-saudi-emerald/20 border border-saudi-emerald/40 rounded-xl">
              <Trophy className="w-5 h-5 text-saudi-emerald" />
              <span className="text-saudi-emerald font-bold text-lg">{score.toLocaleString("ar-SA")}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl">
              <span className="text-saudi-emerald font-bold text-sm">{correctCount}/{currentIndex}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-saudi-black/50 border border-saudi-white/10 rounded-xl">
            <Clock className="w-4 h-4 text-saudi-white/60" />
            <span className={`font-bold text-lg font-mono ${timeLeft < 5 ? "text-saudi-red animate-pulse" : "text-saudi-white"}`}>
              {Math.ceil(timeLeft)}
            </span>
          </div>
        </motion.div>

        {/* Progress dots */}
        <motion.div
          className="flex items-center justify-center gap-1.5 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {questions.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              animate={{
                width: i === currentIndex ? 20 : 6,
                backgroundColor: i < currentIndex ? "#0B8C38" : i === currentIndex ? "#c9a227" : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </motion.div>

        {/* Question */}
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
              <motion.span
                className="inline-block px-4 py-1.5 bg-saudi-emerald/20 border border-saudi-emerald/30 rounded-full text-sm font-bold text-saudi-emerald mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                سؤال {currentIndex + 1} من {QUESTION_COUNT}
              </motion.span>

              <motion.h2
                className="text-xl md:text-2xl font-bold text-saudi-emerald mb-8"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                {currentQuestion.instruction}
              </motion.h2>

              {/* Selected order display */}
              {selectedOrder.length > 0 && (
                <motion.div
                  className="mb-6 flex flex-wrap items-center justify-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-saudi-white/50 text-sm ml-2">الترتيب:</span>
                  {selectedOrder.map((itemIdx, pos) => (
                    <motion.span
                      key={itemIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saudi-emerald/20 border border-saudi-emerald/40 rounded-lg text-saudi-emerald font-bold text-sm"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {pos + 1}. {currentQuestion.items[itemIdx]}
                      <button
                        onClick={() => handleItemClick(itemIdx)}
                        className="text-saudi-red/60 hover:text-saudi-red transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              )}

              {/* Available items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto mb-8">
                {shuffledItems[currentIndex].map((itemIdx) => {
                  const isSelected = selectedOrder.includes(itemIdx);
                  const position = selectedOrder.indexOf(itemIdx);
                  return (
                    <motion.button
                      key={itemIdx}
                      onClick={() => handleItemClick(itemIdx)}
                      disabled={showResult || isSelected}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-right transition-all duration-200 ${
                        isSelected
                          ? "bg-saudi-emerald/10 border-saudi-emerald/30 opacity-40 cursor-default"
                          : showResult
                            ? "bg-saudi-deep/60 border-saudi-emerald/10 opacity-50"
                            : "bg-saudi-deep/60 border-saudi-emerald/15 hover:border-saudi-emerald/40 hover:bg-saudi-green/10 cursor-pointer"
                      }`}
                      whileHover={!isSelected && !showResult ? { scale: 1.02, x: -2 } : {}}
                      whileTap={!isSelected && !showResult ? { scale: 0.98 } : {}}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.4 + (shuffledItems[currentIndex].indexOf(itemIdx)) * 0.08, type: "spring", stiffness: 200, damping: 20 }}
                    >
                      <GripVertical className="w-5 h-5 text-saudi-white/20 flex-shrink-0" />
                      <span className="flex-1 text-lg font-medium text-saudi-white">{currentQuestion.items[itemIdx]}</span>
                      {isSelected && (
                        <span className="w-7 h-7 rounded-full bg-saudi-emerald/30 flex items-center justify-center text-saudi-emerald font-bold text-sm flex-shrink-0">
                          {position + 1}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Correct order display (on wrong answer) */}
              {showResult && !wasCorrect && (
                <motion.div
                  className="mb-6 p-4 bg-saudi-red/10 border border-saudi-red/30 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-saudi-red font-bold text-sm mb-2">الترتيب الصحيح:</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {currentQuestion.correctOrder.map((itemIdx, pos) => (
                      <span key={itemIdx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-saudi-emerald/20 border border-saudi-emerald/30 rounded-lg text-saudi-emerald font-bold text-sm">
                        {pos + 1}. {currentQuestion.items[itemIdx]}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Submit button */}
              {!showResult && (
                <motion.button
                  onClick={handleSubmit}
                  disabled={selectedOrder.length !== currentQuestion.items.length}
                  className="px-8 py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-xl hover:bg-saudi-emerald/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  whileHover={selectedOrder.length === currentQuestion.items.length ? { scale: 1.03 } : {}}
                  whileTap={selectedOrder.length === currentQuestion.items.length ? { scale: 0.97 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  تأكيد الترتيب ({selectedOrder.length}/{currentQuestion.items.length})
                </motion.button>
              )}

              {/* Result indicator */}
              {showResult && (
                <motion.div
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg ${
                    wasCorrect
                      ? "bg-saudi-emerald/20 border border-saudi-emerald text-saudi-emerald"
                      : "bg-saudi-red/20 border border-saudi-red text-saudi-red"
                  }`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {wasCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                  {wasCorrect ? "ترتيب صحيح!" : "ترتيب خاطئ"}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScorePopup points={scorePopup?.points ?? 0} isCorrect={scorePopup?.isCorrect ?? false} responseTime={0} isSpeedBonus={false} />
      <SoundControl />
    </motion.div>
  );
}
