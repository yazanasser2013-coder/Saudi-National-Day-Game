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

export function AnswerCard({
  index,
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
        return "bg-saudi-emerald/20 border-saudi-emerald text-saudi-emerald";
      if (isWrong) return "bg-saudi-red/20 border-saudi-red text-saudi-red";
      return "bg-saudi-green/10 border-saudi-emerald/20 text-saudi-white/70";
    }
    if (isSelected)
      return "bg-saudi-emerald/30 border-saudi-emerald text-saudi-white";
    return "bg-saudi-green/10 border-saudi-emerald/20 text-saudi-white hover:bg-saudi-green/20 hover:border-saudi-emerald/50";
  };
  const getIcon = () => {
    if (showResult && isCorrect)
      return <Check className="w-6 h-6 text-saudi-emerald" />;
    if (showResult && isWrong) return <X className="w-6 h-6 text-saudi-red" />;
    return null;
  };
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative group w-full py-4 px-5 md:py-5 md:px-6 rounded-xl border-2 font-medium text-lg md:text-xl text-right transition-all duration-200 ${getCardClasses()}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.08, ease: "easeOut" }}
      whileHover={!disabled && !showResult ? { scale: 1.02, x: -4 } : {}}
      whileTap={!disabled && !showResult ? { scale: 0.98 } : {}}
      style={
        showResult && isWrong ? { animation: "shake 0.4s ease-in-out" } : {}
      }
    >
      <span className="relative z-10 flex items-center justify-between">
        <span>{text}</span>
        {getIcon()}
      </span>
      {isSelected && !showResult && (
        <motion.div
          className="absolute inset-0 bg-saudi-emerald/10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
      {showResult && isCorrect && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          style={{ boxShadow: "0 0 30px rgba(0,166,81,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
