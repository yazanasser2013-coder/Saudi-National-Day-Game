import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, Flag, Crown, Zap } from "lucide-react";

const stages = [
  { text: "🇸🇦 السؤال الأخير", delay: 500 },
  { text: "20 / 20", delay: 2000 },
  { text: "إذا كنت تعرف الإجابة...\nأثبتها.", delay: 3500 },
  { text: "THE FINAL TEST", delay: 5500 },
];

export function Question20Cinematic({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [stage, setStage] = useState(0);
  const [particles] = useState(() =>
    Array.from({ length: 40 }, (_, id) => ({
      id,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      width: Math.random() * 8 + 3 + "px",
      height: Math.random() * 8 + 3 + "px",
      animationDelay: Math.random() * 2 + "s",
      animationDuration: 2 + Math.random() * 2 + "s",
      background: id % 3 === 0 ? "#C9A227" : "#00A651",
      duration: 2 + Math.random() * 2,
    })),
  );

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

      {/* Atmospheric red glow for final question */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(217,74,17,0.06) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Geometric lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-0 h-[1px] w-full -translate-y-1/2"
          style={{ background: "linear-gradient(90deg, transparent, rgba(217,74,17,0.15), transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.div
          className="absolute left-1/2 top-0 w-[1px] h-full -translate-x-1/2"
          style={{ background: "linear-gradient(180deg, transparent, rgba(201,162,39,0.15), transparent)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 2, delay: 1.3 }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.width,
              height: particle.height,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
              background: particle.background,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{
              duration: particle.duration,
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
                  className="flex flex-col items-center gap-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {/* Crown icons flanking */}
                  <div className="flex items-center gap-4">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <Skull className="w-10 h-10 text-saudi-red animate-pulse" />
                    <Crown className="w-6 h-6 text-amber-400" />
                  </div>

                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-saudi-red/20 border-2 border-saudi-red rounded-full animate-glow-red">
                    <Zap className="w-6 h-6 text-amber-400" />
                    <span className="text-2xl md:text-3xl font-bold text-saudi-red tracking-widest">
                      THE FINAL TEST
                    </span>
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>

                  <motion.p
                    className="text-saudi-white/50 text-sm tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    لا مجال للخطأ. هذا سؤالك الأخير.
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
