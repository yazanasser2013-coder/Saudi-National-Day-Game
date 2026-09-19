import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, ArrowRight } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";

export function PlayerJoin() {
  const { dispatch } = useGame();
  const { playClick, playHover } = useAudio();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("اكتب اسمك أولاً");
      return;
    }
    if (trimmed.length < 2) {
      setError("الاسم قصير جداً");
      return;
    }
    playClick();
    dispatch({ type: "SET_PLAYER", payload: { name: trimmed } });
  };
  return (
    <div className="app min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-green/20 to-saudi-black" />
      <div className="absolute inset-0 opacity-5">
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
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div className="text-center mb-10">
          <motion.h1
            className="font-bold text-3xl md:text-4xl mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            وش اسمك؟
          </motion.h1>
          <motion.p
            className="text-saudi-white/60"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            اكتب اسمك للدخول في التحدي
          </motion.p>
        </motion.div>
        <motion.form
          onSubmit={handleSubmit}
          className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative mb-6">
            <label htmlFor="player-name" className="sr-only">
              اسمك
            </label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saudi-emerald/70" />
              <input
                ref={inputRef}
                id="player-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                placeholder="اكتب اسمك"
                maxLength={20}
                className="w-full pr-12 pl-4 py-4 bg-saudi-black/50 border border-saudi-emerald/30 rounded-xl text-saudi-white placeholder-saudi-white/40 focus:outline-none focus:border-saudi-emerald focus:ring-2 focus:ring-saudi-emerald/20 text-lg"
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>
          {error && (
            <motion.p
              className="text-saudi-red text-sm mb-4 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            onMouseEnter={playHover}
            disabled={!name.trim()}
            className="w-full py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-xl hover:bg-saudi-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            دخول التحدي
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.form>
        <motion.p
          className="text-center text-saudi-white/40 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          سيظهر اسمك في لوحة المتصدرين
        </motion.p>
      </motion.div>
    </div>
  );
}
