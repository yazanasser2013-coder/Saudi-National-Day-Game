import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useGame } from "../context/GameContext";
import { useAudio } from "../hooks/useAudio";

export function SoundControl() {
  const { state, toggleSound } = useGame();
  const { playHover } = useAudio();
  return (
    <motion.button
      onClick={toggleSound}
      onMouseEnter={playHover}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 p-3 rounded-full bg-saudi-green/50 border border-saudi-emerald/30 hover:bg-saudi-green/70 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={state.soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      {state.soundEnabled ? (
        <Volume2 className="w-5 h-5 text-saudi-emerald" />
      ) : (
        <VolumeX className="w-5 h-5 text-saudi-white/50" />
      )}
    </motion.button>
  );
}
