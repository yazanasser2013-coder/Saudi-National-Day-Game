import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, ArrowRight, Plus, X, ArrowLeft } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";

export function PlayerJoin() {
  const { dispatch } = useGame();
  const { playClick, playHover } = useAudio();
  const [mode, setMode] = useState<"single" | "team" | null>(null);
  const [name, setName] = useState("");
  const [teamNames, setTeamNames] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode) inputRef.current?.focus();
  }, [mode]);

  const handleModeSelect = (selected: "single" | "team") => {
    playClick();
    setMode(selected);
    if (selected === "team") setTeamNames(["", ""]);
    setName("");
    setError("");
  };

  const handleAddMember = () => {
    if (teamNames.length < 4) {
      playClick();
      setTeamNames([...teamNames, ""]);
    }
  };

  const handleRemoveMember = (index: number) => {
    if (teamNames.length > 2) {
      playClick();
      setTeamNames(teamNames.filter((_, i) => i !== index));
    }
  };

  const handleTeamNameChange = (index: number, value: string) => {
    const updated = [...teamNames];
    updated[index] = value;
    setTeamNames(updated);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "single") {
      const trimmed = name.trim();
      if (!trimmed) { setError("اكتب اسمك أولاً"); return; }
      if (trimmed.length < 2) { setError("الاسم قصير جداً"); return; }
      playClick();
      dispatch({ type: "SET_PLAYER", payload: { name: trimmed, mode: "single", teamNames: [] } });
    } else {
      const filled = teamNames.map(n => n.trim()).filter(n => n.length >= 2);
      if (filled.length < 2) { setError("اكتب اسماء اعضاء الفريق (2 على الاقل)"); return; }
      playClick();
      dispatch({ type: "SET_PLAYER", payload: { name: filled[0], mode: "team", teamNames: filled } });
    }
  };

  return (
    <div className="app min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-green/20 to-saudi-black" />

      {/* Back Button */}
      <motion.button
        onClick={() => { playClick(); dispatch({ type: "RESET_GAME" }); }}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-saudi-red/20 border border-saudi-red/40 text-saudi-red font-bold text-sm hover:bg-saudi-red/30 transition-all duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
        رجوع
      </motion.button>

      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
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

        <AnimatePresence mode="wait">
          {mode === null ? (
            <motion.div
              key="mode-select"
              className="flex flex-col gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => handleModeSelect("single")}
                onMouseEnter={playHover}
                className="flex items-center justify-center gap-4 py-6 bg-saudi-green/20 border border-saudi-emerald/30 rounded-2xl hover:bg-saudi-green/30 hover:border-saudi-emerald/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="w-8 h-8 text-saudi-emerald" />
                <div className="text-right">
                  <p className="text-saudi-white font-bold text-lg">طالب واحد</p>
                  <p className="text-saudi-white/50 text-sm">ادخل باسمك الشخصي</p>
                </div>
              </motion.button>

              <motion.button
                onClick={() => handleModeSelect("team")}
                onMouseEnter={playHover}
                className="flex items-center justify-center gap-4 py-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-8 h-8 text-amber-400" />
                <div className="text-right">
                  <p className="text-saudi-white font-bold text-lg">فريق</p>
                  <p className="text-saudi-white/50 text-sm">2 إلى 4 اعضاء</p>
                </div>
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="name-form"
              onSubmit={handleSubmit}
              className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.1 }}
            >
              <motion.button
                type="button"
                onClick={() => { playClick(); setMode(null); setError(""); setName(""); setTeamNames(["", ""]); }}
                className="text-saudi-white/50 text-sm mb-4 hover:text-saudi-white transition-colors"
                whileHover={{ x: 5 }}
              >
                ← تغيير الاختيار
              </motion.button>

              {mode === "single" ? (
                <div className="relative mb-6">
                  <label htmlFor="player-name" className="sr-only">اسمك</label>
                  <div className="relative">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-saudi-emerald/70" />
                    <input
                      ref={inputRef}
                      id="player-name"
                      type="text"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                      placeholder="اكتب اسمك"
                      maxLength={20}
                      className="w-full pr-12 pl-4 py-4 bg-saudi-black/50 border border-saudi-emerald/30 rounded-xl text-saudi-white placeholder-saudi-white/40 focus:outline-none focus:border-saudi-emerald focus:ring-2 focus:ring-saudi-emerald/20 text-lg"
                      autoComplete="off"
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {teamNames.map((memberName, index) => (
                    <div key={index} className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
                        <input
                          ref={index === 0 ? inputRef : undefined}
                          type="text"
                          value={memberName}
                          onChange={(e) => handleTeamNameChange(index, e.target.value)}
                          placeholder={`عضو ${index + 1}`}
                          maxLength={20}
                          className="w-full pr-10 pl-4 py-3 bg-saudi-black/50 border border-amber-500/30 rounded-xl text-saudi-white placeholder-saudi-white/40 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-base"
                          autoComplete="off"
                          autoFocus={index === 0}
                        />
                      </div>
                      {teamNames.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(index)}
                          className="p-2 rounded-lg hover:bg-saudi-red/20 text-saudi-red/60 hover:text-saudi-red transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {teamNames.length < 4 && (
                    <motion.button
                      type="button"
                      onClick={handleAddMember}
                      className="w-full py-2 border border-dashed border-amber-500/30 rounded-xl text-amber-400/70 hover:text-amber-400 hover:border-amber-400/50 transition-colors flex items-center justify-center gap-2 text-sm"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Plus className="w-4 h-4" />
                      اضف عضو
                    </motion.button>
                  )}
                </div>
              )}

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
                className="w-full py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-xl hover:bg-saudi-emerald/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                دخول التحدي
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

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
