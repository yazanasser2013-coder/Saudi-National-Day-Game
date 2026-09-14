import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import { useGame } from "../context/GameContext";
import { useAudio } from "../hooks/useAudio";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 4,
}));

export function LandingScreen() {
  const { startGame, toggleSound, state } = useGame();
  const { playClick, playHover } = useAudio();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleStart = () => {
    playClick();
    startGame();
  };
  const handleSoundToggle = () => {
    playClick();
    toggleSound();
  };
  if (!mounted) return null;
  return (
    <div className="app min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="particle"
            style={{
              left: p.x + "%",
              top: p.y + "%",
              width: p.size + "px",
              height: p.size + "px",
              animationDelay: p.delay + "s",
              animationDuration: p.duration + "s",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100"
            height="100"
            fill="url(#grid)"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>
      <motion.div
        className="relative z-10 text-center max-w-2xl w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <span className="text-8xl md:text-9xl">🇸🇦</span>
        </motion.div>
        <motion.h1
          className="font-bold text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          تحدي اليوم الوطني
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-saudi-white/70 mb-10 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          20 سؤالًا. سرعة واحدة. متصدر واحد.
        </motion.p>
        <motion.div
          className="grid grid-cols-4 gap-4 md:gap-6 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        >
          <div className="bg-saudi-green/30 border border-saudi-emerald/30 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-saudi-emerald">
              20
            </div>
            <div className="text-xs md:text-sm text-saudi-white/60">سؤالًا</div>
          </div>
          <div className="bg-saudi-green/30 border border-saudi-emerald/30 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-saudi-emerald">
              10-15
            </div>
            <div className="text-xs md:text-sm text-saudi-white/60">ثانية</div>
          </div>
          <div className="bg-saudi-green/30 border border-saudi-emerald/30 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-saudi-emerald">
              سرعة
            </div>
            <div className="text-xs md:text-sm text-saudi-white/60">+ دقة</div>
          </div>
          <div className="bg-saudi-green/30 border border-saudi-emerald/30 rounded-xl p-4">
            <div className="text-2xl md:text-3xl font-bold text-saudi-emerald">
              🏆
            </div>
            <div className="text-xs md:text-sm text-saudi-white/60">
              Leaderboard
            </div>
          </div>
        </motion.div>
        <motion.button
          onClick={handleStart}
          onMouseEnter={playHover}
          className="group relative inline-flex items-center gap-3 px-10 py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,166,81,0.4)] hover:shadow-[0_0_50px_rgba(0,166,81,0.6)] transition-all duration-300"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="relative z-10">ابدأ التحدي</span>
          <motion.span
            className="absolute right-6 top-1/2 -translate-y-1/2"
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Play className="w-5 h-5" />
          </motion.span>
          <div className="absolute inset-0 bg-saudi-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.button>
        <motion.button
          onClick={handleSoundToggle}
          onMouseEnter={playHover}
          className="absolute bottom-6 left-6 md:bottom-8 md:left-8 p-3 rounded-full bg-saudi-green/50 border border-saudi-emerald/30 hover:bg-saudi-green/70 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          aria-label={state.soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
        >
          {state.soundEnabled ? (
            <svg
              className="w-5 h-5 text-saudi-emerald"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-saudi-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          )}
        </motion.button>
        <motion.div
          className="absolute bottom-4 right-4 md:bottom-8 md:right-8 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <Sparkles className="w-8 h-8 text-saudi-gold" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <Sparkles
            className="w-8 h-8 text-saudi-gold"
            style={{ transform: "rotate(180deg)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
