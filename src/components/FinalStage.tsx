import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface FinalStageProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Array<{ id: string; correct: boolean }>;
}

export function FinalStage({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: FinalStageProps) {
  const progress = answeredQuestions.length;
  const dots = Array.from({ length: 10 }, (_, i) => {
    if (i < progress) return answeredQuestions[i].correct ? "✓" : "×";
    return "●";
  });
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none">
      <motion.div
        className="px-4 py-1 rounded-full bg-saudi-red/30 border-2 border-saudi-red text-saudi-red font-bold text-sm tracking-widest uppercase shadow-[0_0_20px_rgba(217,74,17,0.3)]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        FINAL
      </motion.div>
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {dots.map((dot, i) => (
          <motion.span
            key={i}
            className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${dot === "✓" ? "bg-saudi-emerald text-saudi-black" : dot === "×" ? "bg-saudi-red text-saudi-white" : "bg-saudi-green/20 border border-saudi-emerald/30 text-saudi-white/40"}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            {dot === "✓" && <Check className="w-4 h-4" />}
            {dot === "×" && <X className="w-4 h-4" />}
            {dot === "●" && (
              <span className="w-2 h-2 rounded-full bg-saudi-white/40" />
            )}
          </motion.span>
        ))}
      </motion.div>
      <motion.div
        className="text-saudi-white/60 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        سؤال {currentQuestion} / {totalQuestions}
      </motion.div>
    </div>
  );
}
