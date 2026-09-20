import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Zap, Trophy } from "lucide-react";
import { useAudio } from "../hooks/useAudio";

const challenges = [
  { text: "اتحداك تفوز بالمركز الأول", icon: Trophy, color: "text-amber-400", delay: 0 },
  { text: "20 سؤال. كل ثانية تفرق.", icon: Clock, color: "text-saudi-emerald", delay: 3500 },
  { text: "لو فزت... برفع لك القبعة", icon: Flame, color: "text-saudi-red", delay: 7000 },
  { text: "مستعد؟", icon: Zap, color: "text-amber-400", delay: 10500 },
];

interface PreGameChallengeProps {
  playerName: string;
  onComplete: () => void;
}

export function PreGameChallenge({ playerName, onComplete }: PreGameChallengeProps) {
  const { playClick } = useAudio();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [showReady, setShowReady] = useState(false);

  useEffect(() => {
    const timeouts = challenges.map((c, i) =>
      setTimeout(() => {
        setCurrentChallenge(i);
        if (i === challenges.length - 1) {
          setShowReady(true);
        }
      }, c.delay),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="app min-h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-saudi-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-saudi-emerald/10"
            style={{ width: `${ring * 250}px`, height: `${ring * 250}px` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 0.3, 0] }}
            transition={{
              duration: 2,
              delay: ring * 0.3,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div className="relative z-10 text-center max-w-xl px-6">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-5 py-2 bg-saudi-emerald/20 border border-saudi-emerald/40 rounded-full text-sm font-bold tracking-wider text-saudi-emerald">
            {playerName}
          </span>
        </motion.div>

        <div className="h-64 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!showReady && currentChallenge < challenges.length && (
              <motion.div
                key={currentChallenge}
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {(() => {
                  const ChallengeIcon = challenges[currentChallenge].icon;
                  return (
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-saudi-green/30 border-2 border-saudi-emerald/50 mb-6">
                      <ChallengeIcon className={`w-10 h-10 ${challenges[currentChallenge].color}`} />
                    </div>
                  );
                })()}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-saudi-white leading-tight">
                  {challenges[currentChallenge].text}
                </h2>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
              >
                <motion.button
                  onClick={() => { playClick(); onComplete(); }}
                  className="group relative inline-flex items-center gap-4 px-14 py-5 bg-saudi-emerald text-saudi-black font-bold text-xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(0,166,81,0.5)] hover:shadow-[0_0_70px_rgba(0,166,81,0.7)] transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">يلا نبدأ!</span>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
