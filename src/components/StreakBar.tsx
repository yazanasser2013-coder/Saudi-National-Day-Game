import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface StreakBarProps {
  streak: number;
}

export function StreakBar({ streak }: StreakBarProps) {
  return (
    <AnimatePresence>
      {streak >= 2 && (
        <motion.div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="flex items-center gap-2 px-5 py-2.5 bg-saudi-red/20 border-2 border-saudi-red/50 rounded-full backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 20px rgba(217,74,17,0.3)",
                "0 0 40px rgba(217,74,17,0.6)",
                "0 0 20px rgba(217,74,17,0.3)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
            >
              <Flame className="w-5 h-5 text-saudi-red" />
            </motion.div>
            <span className="text-saudi-red font-bold text-lg">
              {streak}x سلسلة!
            </span>
            {streak >= 5 && (
              <motion.span
                className="text-amber-400 text-sm"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                🔥 خارق!
              </motion.span>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
