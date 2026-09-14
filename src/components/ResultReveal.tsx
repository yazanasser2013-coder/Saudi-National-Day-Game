import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Target,
  Clock,
  Crown,
  Sparkles,
} from "lucide-react";
import { useGame } from "../context/GameContext";
import { useAudio } from "../hooks/useAudio";
import {
  formatScore,
  getPerformanceTitle,
  MAX_POSSIBLE_SCORE,
} from "../utils/scoring";

interface ResultRevealProps {
  rank: number;
  leaderboard: Array<{
    name: string;
    score: number;
    correctAnswers: number;
    averageTime: number;
  }>;
  onRestart: () => void;
}

const celebrations = [
  {
    threshold: 1,
    emoji: "🏆",
    title: "المركز الأول",
    subtitle: "أنت بطل تحدّي اليوم الوطني 🇸🇦",
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/20 border-amber-500",
  },
  {
    threshold: 2,
    emoji: "🥈",
    title: "المركز الثاني",
    subtitle: "أداء ممتاز! كاد أن يكون الأول",
    icon: Medal,
    color: "text-slate-400",
    bg: "bg-slate-500/20 border-slate-500",
  },
  {
    threshold: 3,
    emoji: "🥉",
    title: "المركز الثالث",
    subtitle: "على منصة التتويج!",
    icon: Medal,
    color: "text-amber-600",
    bg: "bg-amber-600/20 border-amber-600",
  },
];

export function ResultReveal({
  rank,
  leaderboard,
  onRestart,
}: ResultRevealProps) {
  const { state } = useGame();
  const { playClick, playHover } = useAudio();

  const [stage, setStage] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const { title: performanceTitle, emoji: performanceEmoji } =
    getPerformanceTitle(state.score, MAX_POSSIBLE_SCORE);

  const isWinner = rank === 1;
  const celebration = celebrations.find((c) => c.threshold === rank);

  useEffect(() => {
    const stages = [
      () => setTimeout(() => setStage(1), 500),

      () => {
        const duration = 1500;
        const start = Date.now();

        const animate = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);

          setAnimatedScore(Math.round(state.score * eased));

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setAnimatedScore(state.score);

            setTimeout(() => setStage(2), 300);
          }
        };

        requestAnimationFrame(animate);
      },

      () => setTimeout(() => setStage(3), 400),

      () => setTimeout(() => setStage(4), 400),

      () => setTimeout(() => setStage(5), 400),

      () => {
        if (isWinner) {
          setShowCelebration(true);
        }

        setTimeout(() => setStage(6), 400);
      },
    ];

    stages[0]();

    let currentStage = 0;

    const nextStage = () => {
      currentStage++;

      if (currentStage < stages.length) {
        stages[currentStage]();
      }
    };

    const interval = setInterval(() => {
      if (stage > currentStage) {
        nextStage();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state.score, isWinner, rank]);

  const handleRestart = () => {
    playClick();
    onRestart();
  };

  return (
    <div className="app min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-saudi-green/20 via-saudi-black to-saudi-black" />

      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <motion.div
              key={i}
              className="particle"
              style={{
                left: "50%",
                top: "50%",
                width: Math.random() * 8 + 4 + "px",
                height: Math.random() * 8 + 4 + "px",
                background: ["#C9A227", "#00A651", "#F5F7F4", "#D94A11"][
                  Math.floor(Math.random() * 4)
                ],
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400 - 200,
                scale: 1,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {stage >= 1 && (
            <motion.div
              key="title"
              className="mb-8"
              initial={{
                opacity: 0,
                y: -30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 30,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <motion.span
                className="inline-block px-4 py-1 bg-saudi-green/30 border border-saudi-emerald/30 rounded-full text-sm font-bold tracking-widest uppercase text-saudi-emerald"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                YOUR RESULT
              </motion.span>
            </motion.div>
          )}

          {stage >= 2 && (
            <motion.div
              key="score"
              className="mb-8"
              initial={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <motion.div
                className="relative inline-block px-8 py-4 bg-saudi-black/50 border-2 border-saudi-emerald rounded-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                }}
              >
                <motion.span className="font-bold text-5xl md:text-7xl lg:text-8xl tabular-nums text-saudi-emerald">
                  {formatScore(animatedScore)}
                </motion.span>
              </motion.div>

              {showCelebration && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64"
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                  }}
                >
                  <svg
                    className="w-full h-full text-amber-400/30"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="10,10"
                    >
                      <animate
                        attributeName="strokeDashoffset"
                        from="0"
                        to="100"
                        dur="10s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                </motion.div>
              )}
            </motion.div>
          )}

          {stage >= 3 && (
            <motion.div
              key="correct"
              className="mb-6 p-4 bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <div className="flex items-center justify-center gap-3 text-saudi-emerald mb-2">
                <Target className="w-6 h-6" />

                <span className="font-bold text-lg">
                  {state.correctAnswers} / 20 صحيحة
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 text-saudi-white/70">
                <Clock className="w-5 h-5" />

                <span>
                  متوسط وقت الإجابة: {state.averageAnswerTime.toFixed(2)} ثانية
                </span>
              </div>
            </motion.div>
          )}

          {stage >= 4 && (
            <motion.div
              key="rank"
              className="mb-8"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              {celebration && (
                <motion.div
                  className={`inline-flex flex-col items-center gap-3 p-6 rounded-2xl border-2 ${celebration.bg}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <celebration.icon
                    className={`w-12 h-12 ${celebration.color}`}
                  />

                  <motion.span
                    className={`text-2xl md:text-3xl font-bold ${celebration.color}`}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.2,
                    }}
                  >
                    {celebration.title}
                  </motion.span>

                  <motion.p
                    className="text-saudi-white/70 max-w-md"
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                  >
                    {celebration.subtitle}
                  </motion.p>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {!celebration && rank > 3 && (
                  <motion.div
                    key="rank-other"
                    className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl bg-saudi-green/20 border-2 border-saudi-emerald/30"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <motion.span
                      className="text-4xl md:text-5xl font-bold text-saudi-emerald"
                      initial={{
                        opacity: 0,
                        scale: 0.5,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                      }}
                    >
                      #{rank}
                    </motion.span>

                    <motion.p
                      className="text-saudi-white/70"
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.3,
                      }}
                    >
                      {performanceEmoji} {performanceTitle}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {stage >= 5 && !celebration && (
            <motion.div
              key="performance"
              className="mb-8 p-4 bg-saudi-green/10 border border-saudi-emerald/20 rounded-xl"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <div className="flex items-center justify-center gap-3">
                {rank <= 10 ? (
                  <Star className="w-6 h-6 text-amber-400" />
                ) : (
                  <Crown className="w-6 h-6 text-saudi-emerald" />
                )}

                <span className="text-xl font-bold text-saudi-white">
                  {performanceEmoji} {performanceTitle}
                </span>
              </div>

              <p className="text-saudi-white/60 mt-2">
                {rank <= 10
                  ? "أداء قوي! أنت في العشرة الأوائل."
                  : "التحدي انتهى... لكن الجولة القادمة لك. 🇸🇦"}
              </p>
            </motion.div>
          )}

          {stage >= 6 && (
            <motion.div
              key="leaderboard"
              className="mb-8 max-h-80 overflow-y-auto"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <h3 className="font-bold text-lg mb-4 text-saudi-emerald flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5" />
                المتصدرون
              </h3>

              <div className="space-y-2">
                {leaderboard.slice(0, 10).map((entry, i) => (
                  <motion.div
                    key={entry.name}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      entry.name === state.player?.name
                        ? "bg-saudi-emerald/20 border border-saudi-emerald/30 ring-2 ring-saudi-emerald/50"
                        : "bg-saudi-green/10 border border-saudi-emerald/20"
                    }`}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.05 * i,
                    }}
                  >
                    <span
                      className={`w-8 text-center font-bold ${
                        i === 0
                          ? "text-amber-400"
                          : i === 1
                            ? "text-slate-400"
                            : i === 2
                              ? "text-amber-600"
                              : "text-saudi-white/60"
                      }`}
                    >
                      {i === 0
                        ? "🥇"
                        : i === 1
                          ? "🥈"
                          : i === 2
                            ? "🥉"
                            : "#" + (i + 1)}
                    </span>

                    <span className="flex-1 text-right truncate font-medium">
                      {entry.name === state.player?.name
                        ? entry.name + " (أنت)"
                        : entry.name}
                    </span>

                    <span className="font-bold tabular-nums text-saudi-emerald">
                      {formatScore(entry.score)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {stage >= 6 && (
            <AnimatePresence mode="wait">
              <motion.button
                key="restart"
                onClick={handleRestart}
                onMouseEnter={playHover}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,166,81,0.4)] hover:shadow-[0_0_50px_rgba(0,166,81,0.6)] transition-all duration-300"
                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.03,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <span className="relative z-10">العب مرة أخرى</span>

                <motion.span
                  className="absolute right-6 top-1/2 -translate-y-1/2"
                  animate={{
                    x: [0, 8, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.span>
              </motion.button>
            </AnimatePresence>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
