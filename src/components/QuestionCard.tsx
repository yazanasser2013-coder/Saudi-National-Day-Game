import { motion } from "framer-motion";
import { AnswerCard } from "./AnswerCard";

interface QuestionCardProps {
  question: { id: string; question: string; answers: string[] };
  selectedIndex: number | null;
  correctIndex: number | null;
  showResult: boolean;
  disabled: boolean;
  onAnswer: (index: number) => void;
}

export function QuestionCard({
  question,
  selectedIndex,
  correctIndex,
  showResult,
  disabled,
  onAnswer,
}: QuestionCardProps) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="mb-8 md:mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="px-4 py-1.5 bg-saudi-green/30 border border-saudi-emerald/30 rounded-full text-sm font-bold text-saudi-emerald">
            {question.id}
          </span>
        </div>
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed text-saudi-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {question.question}
        </motion.h2>
      </div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {question.answers.map((answer, index) => (
          <AnswerCard
            key={index}
            index={index}
            text={answer}
            isSelected={selectedIndex === index}
            isCorrect={showResult && index === correctIndex}
            isWrong={
              showResult && selectedIndex === index && index !== correctIndex
            }
            showResult={showResult}
            disabled={disabled}
            onClick={() => !disabled && !showResult && onAnswer(index)}
            delay={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
