import { motion } from "framer-motion";
import { Target, Zap } from "lucide-react";
import { formatScore } from "../utils/scoring";

interface ScoreDisplayProps {
  score: number;
  correctAnswers: number;
  currentQuestion: number;
  totalQuestions: number;
  phase: 1 | 2 | 3;
  speedBonus?: number;
}

export function ScoreDisplay({
  score,
  currentQuestion,
  totalQuestions,
  phase,
  speedBonus,
}: ScoreDisplayProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
      <motion.div
        className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl p-4 md:p-5 min-w-40 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2 text-saudi-emerald mb-1">
          <Target className="w-5 h-5" />
          <span className="text-sm font-medium tracking-wider uppercase">
            النقاط
          </span>
        </div>
        <motion.span
          className="font-bold text-3xl md:text-4xl tabular-nums text-saudi-white"
          key={score}
        >
          {formatScore(score)}
        </motion.span>
        {speedBonus && speedBonus > 0 && (
          <motion.div
            className="mt-2 flex items-center justify-center gap-1 text-amber-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">
              +{formatScore(speedBonus)} سرعة
            </span>
          </motion.div>
        )}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-saudi-white/60">سؤال</span>
          <span className="font-medium text-saudi-white">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
        <div className="h-2 bg-saudi-green/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-saudi-emerald to-saudi-gold"
            initial={{ width: 0 }}
            animate={{
              width: ((currentQuestion - 1) / totalQuestions) * 100 + "%",
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      <motion.div
        className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${phase === 1 ? "bg-saudi-emerald/20 border-saudi-emerald text-saudi-emerald" : phase === 2 ? "bg-amber-500/20 border-amber-500 text-amber-400" : "bg-saudi-red/20 border-saudi-red text-saudi-red"}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {phase === 1 && "المرحلة 1: السهل"}
        {phase === 2 && "المرحلة 2: الأصعب"}
        {phase === 3 && "المرحلة النهائية 🔥"}
      </motion.div>
    </div>
  );
}
