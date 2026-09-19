import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface AnswerCardProps {
  index: number;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  showResult: boolean;
  disabled: boolean;
  onClick: () => void;
  delay: number;
}

const LETTERS = ["أ", "ب", "ج", "د"];

export function AnswerCard({
  text,
  isSelected,
  isCorrect,
  isWrong,
  showResult,
  disabled,
  onClick,
  delay,
}: AnswerCardProps) {
  const getCardClasses = () => {
    if (showResult) {
      if (isCorrect)
        return "bg-saudi-emerald/15 border-saudi-emerald/60 text-saudi-emerald shadow-[0_0_25px_rgba(11,140,56,0.25)]";
      if (isWrong)
        return "bg-saudi-red/15 border-saudi-red/60 text-saudi-red shadow-[0_0_25px_rgba(217,74,17,0.25)]";
      return "bg-saudi-green/5 border-saudi-emerald/10 text-saudi-white/40 opacity-50";
    }
    if (isSelected)
      return "bg-saudi-emerald/20 border-saudi-emerald text-saudi-white shadow-[0_0_20px_rgba(11,140,56,0.2)]";
    return "bg-saudi-deep/60 border-saudi-emerald/15 text-saudi-white hover:bg-saudi-green/15 hover:border-saudi-emerald/40 hover:shadow-[0_0_15px_rgba(11,140,56,0.1)]";
  };

  const getIcon = () => {
    if (showResult && isCorrect)
      return (
        <motion.div
          className="w-7 h-7 rounded-full bg-saudi-emerald/20 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <Check className="w-4 h-4 text-saudi-emerald" strokeWidth={3} />
        </motion.div>
      );
    if (showResult && isWrong)
      return (
        <motion.div
          className="w-7 h-7 rounded-full bg-saudi-red/20 flex items-center justify-center"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <X className="w-4 h-4 text-saudi-red" strokeWidth={3} />
        </motion.div>
      );
    return null;
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative group w-full py-4 px-5 md:py-4 md:px-5 rounded-xl border-[1.5px] text-right transition-all duration-200 ${getCardClasses()}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.06, ease: "easeOut" }}
      whileHover={!disabled && !showResult ? { scale: 1.015, x: -2 } : {}}
      whileTap={!disabled && !showResult ? { scale: 0.985 } : {}}
      style={
        showResult && isWrong
          ? { animation: "shake 0.4s ease-in-out" }
          : showResult && isCorrect
            ? { animation: "pulse-glow 0.6s ease-in-out 1" }
            : {}
      }
    >
      <span className="relative z-10 flex items-center gap-3">
        {/* Letter badge */}
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors duration-200 ${
            showResult && isCorrect
              ? "bg-saudi-emerald/25 text-saudi-emerald"
              : showResult && isWrong
                ? "bg-saudi-red/25 text-saudi-red"
                : isSelected
                  ? "bg-saudi-emerald/25 text-saudi-emerald"
                  : "bg-saudi-green/10 text-saudi-white/50 group-hover:bg-saudi-emerald/15 group-hover:text-saudi-emerald"
          }`}
        >
          {LETTERS[delay] || delay + 1}
        </span>
        <span className="flex-1 text-sm md:text-base font-medium leading-relaxed">{text}</span>
        {getIcon()}
      </span>

      {/* Hover shimmer */}
      {!disabled && !showResult && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
          <div className="absolute inset-0 animate-shimmer-gold" />
        </div>
      )}

      {/* Selected glow ring */}
      {isSelected && !showResult && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-saudi-emerald/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
