import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, AlertTriangle, Zap, Crown } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";

const messages = [
  { text: "يا أستاذ...", delay: 0.5, icon: AlertTriangle, iconColor: "text-amber-400" },
  { text: "اختار أدفر وأقوى الطلاب عندك.", delay: 2.5, icon: null, iconColor: "" },
  { text: "لأن اللي جاي مااا يرحم. 💀", delay: 4.5, icon: Skull, iconColor: "text-saudi-red" },
  { text: "10 أسئلة. 10 ثوانٍ. والغلط غالي.", delay: 6.5, icon: Zap, iconColor: "text-amber-400" },
];

interface PhaseTransitionProps {
  onComplete: () => void;
}

export function PhaseTransition({ onComplete }: PhaseTransitionProps) {
  const { dispatch } = useGame();
  const { playClick, playHover } = useAudio();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showButton, setShowButton] = useState(false);
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, id) => ({
      id,
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      width: Math.random() * 6 + 2 + "px",
      height: Math.random() * 6 + 2 + "px",
      animationDelay: Math.random() * 3 + "s",
      animationDuration: 3 + Math.random() * 3 + "s",
      duration: 3 + Math.random() * 3,
    })),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev >= messages.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setShowButton(true);
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      dispatch({ type: "ENTER_FINAL_STAGE" });
      onComplete();
    }
  }, [showCountdown, countdown, dispatch, onComplete]);

  const handleReady = () => {
    playClick();
    setShowButton(false);
    setShowCountdown(true);
    setCountdown(3);
  };

  return (
    <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-saudi-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Red warning glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,74,17,0.08) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Pulsing border frame */}
        <motion.div
          className="absolute inset-8 border border-saudi-red/10 rounded-3xl"
          animate={{ borderColor: ["rgba(217,74,17,0.05)", "rgba(217,74,17,0.2)", "rgba(217,74,17,0.05)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Particles */}
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
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 text-center max-w-2xl px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {currentMessage < messages.length && (
            <motion.div
              key={currentMessage}
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {messages[currentMessage].icon && (
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-saudi-red/20 border-2 border-saudi-red mb-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {(() => {
                    const Icon = messages[currentMessage].icon!;
                    return <Icon className={`w-8 h-8 md:w-10 md:h-10 ${messages[currentMessage].iconColor}`} />;
                  })()}
                </motion.div>
              )}
              <motion.h2
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-saudi-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {messages[currentMessage].text}
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        {showButton && (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* THE FINAL FIVE badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-saudi-red/20 border-2 border-saudi-red rounded-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Crown className="w-6 h-6 text-amber-400" />
              <span className="text-xl md:text-2xl font-bold text-saudi-red tracking-widest uppercase">
                THE FINAL FIVE
              </span>
              <Crown className="w-6 h-6 text-amber-400" />
            </motion.div>

            <motion.button
              onClick={handleReady}
              onMouseEnter={playHover}
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-saudi-red text-saudi-white font-bold text-lg rounded-full overflow-hidden shadow-[0_0_30px_rgba(217,74,17,0.4)] hover:shadow-[0_0_50px_rgba(217,74,17,0.6)] transition-all duration-300"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">أنا مستعد</span>
              <motion.span
                className="absolute right-6 top-1/2 -translate-y-1/2"
                animate={{ x: [0, 8, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Zap className="w-5 h-5" />
              </motion.span>
            </motion.button>
          </motion.div>
        )}

        {showCountdown && (
          <AnimatePresence mode="wait">
            <motion.div
              key={countdown}
              className="fixed inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="text-8xl md:text-9xl lg:text-[15rem] font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ color: countdown === 0 ? "#00A651" : "#D94A11" }}
              >
                {countdown === 0 ? "FIRE" : String(countdown)}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
