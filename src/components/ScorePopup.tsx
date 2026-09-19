import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

interface ScorePopupProps {
  points: number;
  isCorrect: boolean;
  responseTime: number;
  isSpeedBonus: boolean;
}

export function ScorePopup({
  points,
  isCorrect,
  responseTime,
  isSpeedBonus,
}: ScorePopupProps) {
  if (!isCorrect) return null;

  return (
    <motion.div
      className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ opacity: [1, 1, 0], scale: [0.5, 1.2, 0.8], y: -80 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-2xl md:text-3xl ${
            isSpeedBonus
              ? "bg-amber-500/30 border-2 border-amber-400 text-amber-400"
              : "bg-saudi-emerald/30 border-2 border-saudi-emerald text-saudi-emerald"
          }`}
        >
          {isSpeedBonus ? (
            <Zap className="w-6 h-6 animate-pulse" />
          ) : (
            <TrendingUp className="w-6 h-6" />
          )}
          <span>+{points.toLocaleString("ar-SA")}</span>
        </div>
        {isSpeedBonus && (
          <motion.span
            className="text-amber-400 text-sm font-bold tracking-wider"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            ⚡ سرعة خارقة! {responseTime.toFixed(1)}s
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
