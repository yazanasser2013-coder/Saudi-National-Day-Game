import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Flag } from "lucide-react";
import { useAudio } from "../hooks/useAudio";

export function Question20Cinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] = useState(0);
  const stages = [
    { text: "🇸🇦 السؤال الأخير", delay: 500 },
    { text: "20 / 20", delay: 2000 },
    { text: "إذا كنت تعرف الإجابة...\\nأثبتها.", delay: 3500 },
    { text: "☠️ FINAL QUESTION", delay: 5500 },
  ];
  useEffect(() => {
    const timeouts = stages.map((s, i) =>
      setTimeout(() => {
        setStage(i + 1);
      }, s.delay),
    );
    const finalTimeout = setTimeout(
      () => {
        onComplete();
      },
      stages[stages.length - 1].delay + 1500,
    );
    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finalTimeout);
    };
  }, [onComplete]);
  return (
    <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-saudi-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }, (_, i) => (
          <motion.div
            key={i}
            className="particle"
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              width: Math.random() * 8 + 3 + "px",
              height: Math.random() * 8 + 3 + "px",
              animationDelay: Math.random() * 2 + "s",
              animationDuration: 2 + Math.random() * 2 + "s",
              background: i % 3 === 0 ? "#C9A227" : "#00A651",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {stage > 0 && stage <= stages.length && (
            <motion.div
              key={stage}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {stage === 1 && (
                <motion.div
                  className="inline-flex items-center gap-3 mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <Flag className="w-10 h-10 text-saudi-emerald" />
                  <span className="text-2xl md:text-3xl font-bold text-saudi-white">
                    السؤال الأخير
                  </span>
                </motion.div>
              )}
              {stage === 2 && (
                <motion.div
                  className="mb-6"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                >
                  <span className="text-5xl md:text-7xl lg:text-9xl font-bold text-saudi-emerald tracking-wider">
                    20 / 20
                  </span>
                </motion.div>
              )}
              {stage === 3 && (
                <motion.p
                  className="text-xl md:text-2xl text-saudi-white/80 leading-relaxed max-w-md mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  إذا كنت تعرف الإجابة...
                  <br />
                  <span className="font-bold text-saudi-emerald">أثبتها.</span>
                </motion.p>
              )}
              {stage === 4 && (
                <motion.div
                  className="inline-flex items-center gap-3 px-6 py-3 bg-saudi-red/20 border-2 border-saudi-red rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <Skull className="w-8 h-8 text-saudi-red animate-pulse" />
                  <span className="text-2xl md:text-3xl font-bold text-saudi-red tracking-widest">
                    FINAL QUESTION
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
