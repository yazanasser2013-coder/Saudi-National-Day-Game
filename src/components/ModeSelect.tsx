import { motion } from "framer-motion";
import { Trophy, ListOrdered, Check, Keyboard, ArrowLeft } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import type { GameMode } from "../types/game";

const modes = [
  {
    id: "quiz" as GameMode,
    title: "التحدي الرئيسي",
    description: "20 سؤالًا عبر 3 مراحل",
    icon: Trophy,
    color: "from-emerald-500/20 to-amber-500/20",
    borderColor: "border-saudi-emerald/40",
    iconColor: "text-saudi-emerald",
    glow: "hover:shadow-[0_0_40px_rgba(11,140,56,0.3)]",
    badge: "كلاسيكي",
    badgeColor: "bg-saudi-emerald/20 text-saudi-emerald",
  },
  {
    id: "sort-challenge" as GameMode,
    title: "ترتيب",
    description: "رتب العناصر في الترتيب الصحيح",
    icon: ListOrdered,
    color: "from-amber-500/20 to-emerald-500/20",
    borderColor: "border-saudi-gold/40",
    iconColor: "text-amber-400",
    glow: "hover:shadow-[0_0_40px_rgba(201,162,39,0.3)]",
    badge: "ترتيب",
    badgeColor: "bg-saudi-gold/20 text-amber-400",
  },
  {
    id: "true-false" as GameMode,
    title: "صح أو خطأ",
    description: "15 سؤال binary، اختبر معلوماتك",
    icon: Check,
    color: "from-red-500/20 to-amber-500/20",
    borderColor: "border-saudi-red/40",
    iconColor: "text-saudi-red",
    glow: "hover:shadow-[0_0_40px_rgba(217,74,17,0.3)]",
    badge: "معلومة",
    badgeColor: "bg-saudi-red/20 text-saudi-red",
  },
  {
    id: "typing-challenge" as GameMode,
    title: "تحدي الكتابة",
    description: "اكتب الإجابة بالعربية",
    icon: Keyboard,
    color: "from-emerald-500/20 to-amber-500/20",
    borderColor: "border-saudi-emerald/40",
    iconColor: "text-saudi-emerald",
    glow: "hover:shadow-[0_0_40px_rgba(11,140,56,0.3)]",
    badge: "تحدي",
    badgeColor: "bg-saudi-emerald/20 text-saudi-emerald",
  },
];

export function ModeSelect() {
  const { dispatch } = useGame();
  const { playClick, playHover } = useAudio();

  const handleSelect = (gameMode: GameMode) => {
    playClick();
    dispatch({ type: "SELECT_MODE", payload: { gameMode } });
  };

  return (
    <motion.div
      className="app min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-green/15 to-saudi-black" />
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="mode-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mode-grid)" />
        </svg>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div className="text-center mb-10">
          <motion.button
            onClick={() => { playClick(); dispatch({ type: "GO_TO_JOIN" }); }}
            className="inline-flex items-center gap-2 text-saudi-white/50 hover:text-saudi-white text-sm mb-4 transition-colors"
            whileHover={{ x: 5 }}
          >
            <ArrowLeft className="w-4 h-4" />
            تغيير الاسم
          </motion.button>
          <motion.h1
            className="font-bold text-3xl md:text-4xl mb-3 text-saudi-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            اختر التحدي
          </motion.h1>
          <motion.p
            className="text-saudi-white/60"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            اختر نوع اللعب الذي تريده
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modes.map((mode, i) => (
            <motion.button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              onMouseEnter={playHover}
              className={`relative group text-right p-6 rounded-2xl border ${mode.borderColor} bg-gradient-to-br ${mode.color} backdrop-blur-sm transition-all duration-300 ${mode.glow}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div className="absolute top-4 left-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${mode.badgeColor}`}>
                  {mode.badge}
                </span>
              </motion.div>

              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-4`}>
                <mode.icon className={`w-7 h-7 ${mode.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-saudi-white mb-2">{mode.title}</h3>
              <p className="text-saudi-white/60 text-sm leading-relaxed">{mode.description}</p>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 animate-shimmer-gold" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
