import { motion, AnimatePresence } from "framer-motion";
import { Target, Zap, Flame, Crown, Shield } from "lucide-react";
import { formatScore } from "../utils/scoring";

interface ScoreDisplayProps {
  score: number;
  correctAnswers: number;
  currentQuestion: number;
  totalQuestions: number;
  phase: 1 | 2 | 3;
  speedBonus?: number;
  streak?: number;
  multiplier?: number;
}

export function ScoreDisplay({
  score,
  correctAnswers,
  currentQuestion,
  totalQuestions,
  phase,
  speedBonus,
  streak = 0,
}: ScoreDisplayProps) {
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;
  const accuracy = currentQuestion > 1
    ? Math.round((correctAnswers / (currentQuestion - 1)) * 100)
    : 100;

  const phaseConfig = {
    1: { label: "المرحلة 1", sub: "المعرفة", icon: Shield, color: "text-saudi-emerald", bg: "bg-saudi-emerald/15", border: "border-saudi-emerald/40", glow: "rgba(11,140,56,0.3)" },
    2: { label: "المرحلة 2", sub: "السرعة", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/40", glow: "rgba(245,158,11,0.3)" },
    3: { label: "المرحلة 3", sub: "التحدي", icon: Crown, color: "text-saudi-red", bg: "bg-saudi-red/15", border: "border-saudi-red/40", glow: "rgba(217,74,17,0.3)" },
  };
  const pc = phaseConfig[phase];
  const PhaseIcon = pc.icon;

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: Score + Phase badge */}
      <div className="flex items-center justify-between gap-4">
        {/* Score */}
        <motion.div
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-saudi-deep/80 border border-saudi-emerald/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-10 h-10 rounded-xl bg-saudi-emerald/15 flex items-center justify-center">
            <Target className="w-5 h-5 text-saudi-emerald" />
          </div>
          <div className="text-right">
            <motion.p
              className="font-bold text-2xl md:text-3xl tabular-nums text-saudi-white leading-none"
              key={score}
              initial={{ scale: 1.1, color: "#14a840" }}
              animate={{ scale: 1, color: "#F2F2F2" }}
              transition={{ duration: 0.3 }}
            >
              {formatScore(score)}
            </motion.p>
            <p className="text-[10px] text-saudi-white/40 font-medium tracking-wider uppercase mt-0.5">النقاط</p>
          </div>
          <AnimatePresence>
            {speedBonus && speedBonus > 0 && (
              <motion.div
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/30"
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-xs font-bold text-amber-400 tabular-nums">+{formatScore(speedBonus)}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Phase badge */}
        <motion.div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full ${pc.bg} border ${pc.border}`}
          style={{ boxShadow: `0 0 20px ${pc.glow}` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          key={phase}
        >
          <PhaseIcon className={`w-4 h-4 ${pc.color}`} />
          <div className="text-right">
            <p className={`text-xs font-bold ${pc.color} leading-none`}>{pc.label}</p>
            <p className="text-[10px] text-saudi-white/40 leading-none mt-0.5">{pc.sub}</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom row: Progress bar + stats */}
      <div className="flex items-center gap-4">
        {/* Progress bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-saudi-white/40 font-medium">
              سؤال {currentQuestion} / {totalQuestions}
            </span>
            <span className="text-saudi-white/40 font-medium tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-saudi-green/20 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: phase === 3
                  ? "linear-gradient(90deg, #D94A11, #F59E0B)"
                  : phase === 2
                    ? "linear-gradient(90deg, #F59E0B, #c9a227)"
                    : "linear-gradient(90deg, #0B8C38, #14a840)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="absolute inset-0 animate-shimmer-gold" />
            </motion.div>
          </div>
        </div>

        {/* Streak / Accuracy mini-badges */}
        <div className="flex items-center gap-2">
          {streak >= 2 && (
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-saudi-red/15 border border-saudi-red/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              key={`streak-${streak}`}
            >
              <Flame className="w-3.5 h-3.5 text-saudi-red" />
              <span className="text-xs font-bold text-saudi-red tabular-nums">{streak}x</span>
            </motion.div>
          )}
          {currentQuestion > 1 && (
            <motion.div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                accuracy >= 80 ? "bg-saudi-emerald/15 border border-saudi-emerald/30" :
                accuracy >= 50 ? "bg-amber-500/15 border border-amber-500/30" :
                "bg-saudi-red/15 border border-saudi-red/30"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Target className={`w-3.5 h-3.5 ${
                accuracy >= 80 ? "text-saudi-emerald" :
                accuracy >= 50 ? "text-amber-400" :
                "text-saudi-red"
              }`} />
              <span className={`text-xs font-bold tabular-nums ${
                accuracy >= 80 ? "text-saudi-emerald" :
                accuracy >= 50 ? "text-amber-400" :
                "text-saudi-red"
              }`}>{accuracy}%</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
