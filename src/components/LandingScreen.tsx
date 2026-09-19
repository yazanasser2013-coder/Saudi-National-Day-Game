import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Shield, Zap, Trophy, Clock } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import BackgroundSystem from "./BackgroundSystem";

const statCards = [
  { value: "20", label: "سؤالًا", icon: Trophy, color: "text-saudi-emerald" },
  { value: "10–15", label: "ثانية", icon: Clock, color: "text-saudi-amber" },
  { value: "سرعة + دقة", label: "نظام النقاط", icon: Zap, color: "text-saudi-gold" },
  { value: "🏆", label: "Leaderboard", icon: Shield, color: "text-saudi-red" },
];

export function LandingScreen() {
  const { startGame, toggleSound, state } = useGame();
  const { playClick, playHover } = useAudio();
  const handleStart = () => { playClick(); startGame(); };
  const handleSoundToggle = () => { playClick(); toggleSound(); };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <BackgroundSystem intensity={1} />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="relative z-20 p-6 md:p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass-elevated flex items-center justify-center" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}>
              <span className="text-2xl md:text-3xl">🇸🇦</span>
            </motion.div>
            <div>
              <p className="font-display font-bold text-xl md:text-2xl text-saudi-white">اليوم الوطني</p>
              <p className="text-xs md:text-sm text-saudi-white/50 font-medium tracking-widest uppercase">Saudi National Day</p>
            </div>
          </div>
          <motion.button onClick={handleSoundToggle} onMouseEnter={playHover} className="p-3 rounded-xl glass hover:glass-elevated transition-all duration-300" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} aria-label={state.soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}>
            {state.soundEnabled ? (<svg className="w-5 h-5 text-saudi-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>) : (<svg className="w-5 h-5 text-saudi-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>)}
          </motion.button>
        </header>
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-10">
          <motion.div className="relative z-10 w-full max-w-5xl text-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div className="mb-8 flex flex-col items-center gap-4" initial={{ opacity: 0, scale: 0.8, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              <motion.div className="relative inline-flex items-center justify-center" style={{ filter: "drop-shadow(0 0 40px rgba(0, 166, 81, 0.4))" }}>
                <motion.div className="absolute -inset-4 rounded-full bg-gradient-to-r from-saudi-emerald/30 via-saudi-gold/30 to-saudi-red/30 blur-2xl" animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
                <span className="relative text-7xl md:text-9xl lg:text-[8rem] font-display">🇸🇦</span>
              </motion.div>
            </motion.div>
            <motion.h1 className="font-display font-bold text-4xl md:text-6xl lg:text-8xl xl:text-9xl leading-[1.1] tracking-tight mb-6 text-saudi-white" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}>
              <span className="block">تحدّي</span>
              <span className="block text-gradient-gold">اليوم الوطني</span>
            </motion.h1>
            <motion.p className="text-lg md:text-xl lg:text-2xl text-saudi-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}>عشرين سؤالاً. سرعة واحدة. متصدر واحد.</motion.p>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              {statCards.map((stat, i) => (
                <motion.div key={stat.label} className="group relative glass hover:glass-elevated p-5 md:p-6 rounded-2xl transition-all duration-500" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -6, scale: 1.02 }}>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <motion.div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl glass flex items-center justify-center" whileHover={{ scale: 1.1, rotate: 3 }} transition={{ duration: 0.3 }}>
                      {stat.icon ? <stat.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: stat.color }} /> : <span className="text-3xl md:text-4xl">{stat.value}</span>}
                    </motion.div>
                    <div className="text-right">
                      <p className="font-display font-bold text-2xl md:text-3xl lg:text-4xl" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs md:text-sm text-saudi-white/50 font-medium tracking-wider uppercase">{stat.label}</p>
                    </div>
                  </div>
                  <motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-saudi-emerald/10 via-transparent to-saudi-gold/10 opacity-0 group-hover:opacity-100" transition={{ duration: 0.5 }} />
                </motion.div>
              ))}
            </motion.div>
            <motion.button onClick={handleStart} onMouseEnter={playHover} className="group relative inline-flex items-center gap-4 px-12 py-5 md:px-16 md:py-6 bg-saudi-emerald text-saudi-black font-bold text-lg md:text-xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,166,81,0.5)] hover:shadow-[0_0_60px_rgba(0,166,81,0.7)] transition-all duration-500" initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }} whileHover={{ scale: 1.04, y: -3, boxShadow: "0 0 80px rgba(0,166,81,0.6)" }} whileTap={{ scale: 0.98 }}>
              <span className="relative z-10 flex items-center gap-3">ابدأ التحدي <motion.div className="w-8 h-8 rounded-full bg-saudi-gold/20 flex items-center justify-center"><motion.span className="w-5 h-5 text-saudi-gold" animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}><ArrowRight className="w-5 h-5" /></motion.span></motion.div></span>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-saudi-gold via-saudi-amber to-saudi-gold opacity-0 group-hover:opacity-100" transition={{ duration: 0.5 }} />
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%]" transition={{ duration: 0.8 }} />
            </motion.button>
            <motion.p className="mt-10 text-saudi-white/40 text-sm font-medium tracking-wider uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>اضغط للبدء · سيظهر اسمك في لوحة المتصدرين</motion.p>
          </motion.div>
        </main>
        <footer className="relative z-20 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div className="flex items-center gap-6 text-saudi-white/40 text-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
            <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-saudi-emerald" /> آمن وموثوق</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-saudi-gold" /> وقت حقيقي</span>
            <span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-saudi-gold" /> تنافس عادل</span>
          </motion.div>
          <motion.div className="flex items-center gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}>
            <span className="text-saudi-white/30 text-sm">النسخة 1.0.0</span>
            <motion.div className="w-2 h-2 rounded-full bg-saudi-emerald animate-pulse-glow" />
            <span className="text-saudi-white/30 text-sm">مباشر</span>
          </motion.div>
        </footer>
      </div>
      <CornerAccents />
    </div>
  );
}

function CornerAccents() {
  return (
    <>
      <motion.div className="absolute top-6 right-6 md:top-10 md:right-10 opacity-30" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.3, scale: 1 }} transition={{ delay: 1.8, duration: 1 }}><Sparkles className="w-10 h-10 text-saudi-gold" /></motion.div>
      <motion.div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 opacity-30" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.3, scale: 1 }} transition={{ delay: 1.9, duration: 1 }}><Sparkles className="w-10 h-10 text-saudi-gold" style={{ transform: "rotate(180deg)" }} /></motion.div>
      <motion.div className="absolute top-6 left-6 md:top-10 md:left-10 opacity-20" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.2, scale: 1 }} transition={{ delay: 2, duration: 1 }}><Shield className="w-8 h-8 text-saudi-emerald" /></motion.div>
      <motion.div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 opacity-20" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.2, scale: 1 }} transition={{ delay: 2.1, duration: 1 }}><Zap className="w-8 h-8 text-saudi-gold" /></motion.div>
    </>
  );
}
