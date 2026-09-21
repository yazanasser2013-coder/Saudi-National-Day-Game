import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  Star,
  Target,
  Clock,
  Crown,
  Share2,
  RotateCcw,
  TrendingUp,
  Zap,
  Flame,
  Award,
  Shield,
  Sparkles,
  Trash2,
  Eraser,
} from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import {
  formatScore,
  getPerformanceTitle,
  MAX_POSSIBLE_SCORE,
} from "../utils/scoring";
import { deleteFromLeaderboard, clearLeaderboard, OWNER_NAME } from "../utils/leaderboard";
import { Confetti } from "./Confetti";
import type { LeaderboardEntry } from "../utils/leaderboard";

interface ResultRevealProps {
  rank: number;
  leaderboard: LeaderboardEntry[];
  onRestart: () => void;
}

interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgColor: string;
  condition: (stats: PlayerStats) => boolean;
}

interface PlayerStats {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  fastestAnswer: number;
  averageTime: number;
  wrongAnswers: number;
  timeouts: number;
  maxStreak: number;
  phase3Correct: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "perfect",
    title: "كامل!",
    subtitle: "20/20 إجابة صحيحة",
    icon: Crown,
    color: "text-amber-400",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/15",
    condition: (s) => s.correctAnswers === s.totalQuestions,
  },
  {
    id: "speedDemon",
    title: "شيطان السرعة",
    subtitle: "أسرع إجابة أقل من 1.5 ثانية",
    icon: Zap,
    color: "text-amber-400",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/15",
    condition: (s) => s.fastestAnswer < 1.5,
  },
  {
    id: "noMistakes",
    title: "بدون أخطاء",
    subtitle: "لم تختر إجابة خاطئة",
    icon: Shield,
    color: "text-saudi-emerald",
    borderColor: "border-saudi-emerald/50",
    bgColor: "bg-saudi-emerald/15",
    condition: (s) => s.wrongAnswers === 0 && s.timeouts === 0,
  },
  {
    id: "streakMaster",
    title: "سيد السلسلة",
    subtitle: "5 إجابات صحيحة متتالية",
    icon: Flame,
    color: "text-saudi-red",
    borderColor: "border-saudi-red/50",
    bgColor: "bg-saudi-red/15",
    condition: (s) => s.maxStreak >= 5,
  },
  {
    id: "fastThinker",
    title: "سريع البديهة",
    subtitle: "متوسط إجابة أقل من 4 ثوانٍ",
    icon: TrendingUp,
    color: "text-amber-400",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/15",
    condition: (s) => s.averageTime < 4,
  },
  {
    id: "phase3Conqueror",
    title: "فارس المرحلة النهائية",
    subtitle: "أجب صحيح على 4+ من المرحلة 3",
    icon: Award,
    color: "text-saudi-emerald",
    borderColor: "border-saudi-emerald/50",
    bgColor: "bg-saudi-emerald/15",
    condition: (s) => s.phase3Correct >= 4,
  },
  {
    id: "noTimeouts",
    title: "ضد الساعة",
    subtitle: "لم تنفد الوقت في أي سؤال",
    icon: Clock,
    color: "text-saudi-emerald",
    borderColor: "border-saudi-emerald/50",
    bgColor: "bg-saudi-emerald/15",
    condition: (s) => s.timeouts === 0,
  },
  {
    id: "highScorer",
    title: "نجم نقاط",
    subtitle: " أكثر من 15000 نقطة",
    icon: Sparkles,
    color: "text-amber-400",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-500/15",
    condition: (s) => s.score > 15000,
  },
];

const rankBadges = [
  {
    threshold: 1,
    emoji: "🏆",
    title: "بطل التحدي",
    subtitle: "أنت أسطورة اليوم الوطني! 🇸🇦",
    icon: Trophy,
    color: "from-amber-400 to-yellow-600",
    textColor: "text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_60px_rgba(245,158,11,0.4)]",
  },
  {
    threshold: 2,
    emoji: "🥈",
    title: "الوصيف",
    subtitle: "أداء استثنائي! كاد أن يكون الأول",
    icon: Medal,
    color: "from-slate-300 to-slate-500",
    textColor: "text-slate-300",
    bg: "bg-slate-500/20",
    border: "border-slate-500/50",
    glow: "shadow-[0_0_40px_rgba(148,163,184,0.3)]",
  },
  {
    threshold: 3,
    emoji: "🥉",
    title: "المركز الثالث",
    subtitle: "على منصة التتويج! أداء رائع",
    icon: Medal,
    color: "from-amber-600 to-amber-800",
    textColor: "text-amber-600",
    bg: "bg-amber-600/20",
    border: "border-amber-600/50",
    glow: "shadow-[0_0_40px_rgba(217,190,17,0.3)]",
  },
];

function getMedalEmoji(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export function ResultReveal({
  rank,
  leaderboard,
  onRestart,
}: ResultRevealProps) {
  const { state } = useGame();
  const { playClick, playHover } = useAudio();
  const isOwner = state.player?.isOwner ?? false;

  const [stage, setStage] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [leaderboardState, setLeaderboardState] = useState(leaderboard);

  const handleDeleteEntry = (id: string) => {
    playClick();
    deleteFromLeaderboard(id);
    setLeaderboardState((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAll = () => {
    playClick();
    clearLeaderboard();
    setLeaderboardState([]);
  };

  const { title: performanceTitle, emoji: performanceEmoji } =
    getPerformanceTitle(state.score, MAX_POSSIBLE_SCORE);

  const isTop3 = rank <= 3;
  const badge = rankBadges.find((b) => b.threshold === rank);
  const accuracy = state.questions.length
    ? Math.round((state.correctAnswers / state.questions.length) * 100)
    : 0;

  const playerStats: PlayerStats = {
    score: state.score,
    correctAnswers: state.correctAnswers,
    totalQuestions: state.questions.length,
    accuracy,
    fastestAnswer: state.fastestAnswer,
    averageTime: state.averageAnswerTime,
    wrongAnswers: state.wrongAnswers,
    timeouts: state.timeouts,
    maxStreak: 0,
    phase3Correct: 0,
  };

  // Calculate max streak from response times
  let streak = 0;
  state.answeredQuestions.forEach((_q, i) => {
    if (i < state.correctAnswers) {
      streak++;
      playerStats.maxStreak = Math.max(playerStats.maxStreak, streak);
    } else {
      streak = 0;
    }
  });

  // Count phase 3 correct answers
  playerStats.phase3Correct = state.answeredQuestions
    .filter((item) => item.phase === 3)
    .filter((_, i) => {
      const phase3Answers = state.answeredQuestions.filter((q) => q.phase === 3);
      const idx = state.answeredQuestions.filter((q) => q.phase === 3).indexOf(phase3Answers[i]);
      return idx < state.correctAnswers;
    }).length;

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.condition(playerStats));

  const particles = useState(() =>
    Array.from({ length: 60 }, (_, id) => ({
      id,
      width: Math.random() * 10 + 4 + "px",
      height: Math.random() * 10 + 4 + "px",
      background: ["#C9A227", "#00A651", "#F5F7F4", "#D94A11", "#ffffff"][
        Math.floor(Math.random() * 5)
      ],
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600 - 300,
      delay: Math.random() * 2,
    })),
  )[0];

  useEffect(() => {
    if (stage >= 8) return;

    let timeout: ReturnType<typeof setTimeout>;
    let animationFrame: number;

    if (stage === 1) {
      const duration = 1800;
      const start = Date.now();

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        setAnimatedScore(Math.round(state.score * eased));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setAnimatedScore(state.score);
          timeout = setTimeout(() => setStage(2), 400);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    } else {
      timeout = setTimeout(
        () => setStage(stage + 1),
        stage === 0 ? 600 : 500,
      );
    }

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [stage, state.score]);

  const handleShare = useCallback(() => {
    playClick();
    const text = `🇸🇦 تحدّي اليوم الوطني السعودي\n🏆 المركز #${rank} | ${formatScore(state.score)} نقطة | ${state.correctAnswers}/20 صحيحة\n\n${performanceEmoji} ${performanceTitle}\n\n#اليوم_الوطنی_السعودی #تحدي`;
    if (navigator.share) {
      navigator.share({ title: "تحدي اليوم الوطني", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => setShowShare(true));
      setTimeout(() => setShowShare(false), 2000);
    }
  }, [playClick, rank, state.score, state.correctAnswers, performanceTitle, performanceEmoji]);

  return (
    <div className="app min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-saudi-green/20 via-saudi-black to-saudi-black" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saudi-emerald/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Particles */}
      {stage >= 3 && (
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="particle"
              style={{
                left: "50%",
                top: "40%",
                width: particle.width,
                height: particle.height,
                background: particle.background,
              }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{
                x: particle.x,
                y: particle.y,
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <Confetti active={isTop3 && stage >= 5} count={isTop3 ? 80 : 0} />

      <motion.div
        className="relative z-10 w-full max-w-2xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence mode="wait">
          {/* Stage 1: Title badge */}
          {stage >= 1 && (
            <motion.div
              key="title-badge"
              className="mb-6"
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            >
              <motion.span
                className="inline-block px-6 py-2 bg-saudi-emerald/20 border border-saudi-emerald/40 rounded-full text-sm font-bold tracking-widest uppercase text-saudi-emerald"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                🎯 نتائج التحدي
              </motion.span>
            </motion.div>
          )}

          {/* Stage 1: Score counter */}
          {stage >= 1 && (
            <motion.div
              key="score-main"
              className="mb-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className="relative inline-block">
                {/* Glow ring */}
                <motion.div
                  className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-saudi-emerald/20 via-saudi-gold/20 to-saudi-emerald/20 blur-xl"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative px-10 py-6 bg-saudi-black/60 border-2 border-saudi-emerald/50 rounded-3xl backdrop-blur-sm">
                  <motion.span className="font-bold text-6xl md:text-8xl lg:text-9xl tabular-nums text-saudi-emerald drop-shadow-[0_0_30px_rgba(11,140,56,0.5)]">
                    {formatScore(animatedScore)}
                  </motion.span>
                  <p className="text-saudi-white/50 text-sm mt-2 font-medium tracking-wider">
                    نقطة
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 2: Performance + accuracy stats */}
          {stage >= 2 && (
            <motion.div
              key="stats-row"
              className="mb-6 grid grid-cols-3 gap-3 max-w-lg mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Target className="w-5 h-5 text-saudi-emerald mx-auto mb-1" />
                <motion.p
                  className="font-bold text-xl text-saudi-white tabular-nums"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {state.correctAnswers}/{state.questions.length}
                </motion.p>
                <p className="text-xs text-saudi-white/50">صحيحة</p>
              </motion.div>
              <motion.div
                className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrendingUp className="w-5 h-5 text-saudi-emerald mx-auto mb-1" />
                <motion.p
                  className="font-bold text-xl text-saudi-white tabular-nums"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  {accuracy}%
                </motion.p>
                <p className="text-xs text-saudi-white/50">الدقة</p>
              </motion.div>
              <motion.div
                className="bg-saudi-green/20 border border-saudi-emerald/30 rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Clock className="w-5 h-5 text-saudi-emerald mx-auto mb-1" />
                <motion.p
                  className="font-bold text-xl text-saudi-white tabular-nums"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {state.averageAnswerTime.toFixed(1)}s
                </motion.p>
                <p className="text-xs text-saudi-white/50">متوسط الوقت</p>
              </motion.div>
            </motion.div>
          )}

          {/* Stage 3: Speed + streak stats */}
          {stage >= 3 && (
            <motion.div
              key="stats-row-2"
              className="mb-8 grid grid-cols-2 gap-3 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-saudi-white tabular-nums">
                    {state.fastestAnswer === Infinity
                      ? "—"
                      : state.fastestAnswer.toFixed(1) + "s"}
                  </p>
                  <p className="text-xs text-saudi-white/50">أسرع إجابة</p>
                </div>
              </div>
              <div className="bg-saudi-red/10 border border-saudi-red/30 rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-saudi-red/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-saudi-red" />
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-saudi-white tabular-nums">
                    {state.wrongAnswers}
                  </p>
                  <p className="text-xs text-saudi-white/50">أخطاء</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stage 4: Achievements */}
          {stage >= 4 && unlockedAchievements.length > 0 && (
            <motion.div
              key="achievements"
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-sm font-bold text-saudi-white/60 tracking-widest uppercase mb-4">الإنجازات</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {unlockedAchievements.map((achievement, i) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${achievement.bgColor} border ${achievement.borderColor}`}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
                    >
                      <Icon className={`w-5 h-5 ${achievement.color}`} />
                      <div className="text-right">
                        <p className={`text-sm font-bold ${achievement.color}`}>{achievement.title}</p>
                        <motion.p
                          className="text-[10px] text-saudi-white/40"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.15 + 0.2 }}
                        >{achievement.subtitle}</motion.p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Stage 5: Rank / badge */}
          {stage >= 5 && (
            <motion.div
              key="rank-badge"
              className="mb-8"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            >
              {badge ? (
                <motion.div
                  className={`inline-flex flex-col items-center gap-4 p-8 rounded-3xl border-2 ${badge.bg} ${badge.border} ${badge.glow}`}
                  initial={{ scale: 0.7, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <motion.span
                    className="text-6xl md:text-7xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    {badge.emoji}
                  </motion.span>
                  <motion.span
                    className={`text-3xl md:text-4xl font-bold ${badge.textColor}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {badge.title}
                  </motion.span>
                  <motion.p
                    className="text-saudi-white/70 max-w-sm text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {badge.subtitle}
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div
                  className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-saudi-green/20 border-2 border-saudi-emerald/30"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <motion.span
                    className="text-5xl md:text-6xl font-bold text-saudi-emerald"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    #{rank}
                  </motion.span>
                  <motion.p
                    className="text-saudi-white/70 text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {performanceEmoji} {performanceTitle}
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Stage 6: Performance title (non-top-3) */}
          {stage >= 6 && !isTop3 && (
            <motion.div
              key="perf-title"
              className="mb-8 p-5 bg-saudi-green/10 border border-saudi-emerald/20 rounded-2xl max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3">
                {rank <= 10 ? (
                  <Star className="w-6 h-6 text-amber-400" />
                ) : (
                  <Crown className="w-6 h-6 text-saudi-emerald" />
                )}
                <motion.span
                  className="text-xl font-bold text-saudi-white"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {performanceEmoji} {performanceTitle}
                </motion.span>
              </div>
              <motion.p
                className="text-saudi-white/60 mt-3 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {rank <= 10
                  ? "أداء قوي! أنت في العشرة الأوائل. 💪"
                  : "التحدي انتهى... لكن الجولة القادمة لك. 🇸🇦"}
              </motion.p>
            </motion.div>
          )}

          {/* Stage 6: Leaderboard */}
          {stage >= 6 && leaderboardState.length > 0 && (
            <motion.div
              key="leaderboard"
              className="mb-8 max-h-72 overflow-y-auto scrollbar-hide rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-saudi-emerald flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  لوحة المتصدرين
                </h3>
                {isOwner && (
                  <motion.button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-saudi-red/20 border border-saudi-red/40 rounded-lg text-saudi-red text-xs font-bold hover:bg-saudi-red/30 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    مسح الكل
                  </motion.button>
                )}
              </div>

              <div className="space-y-2">
                {leaderboardState.slice(0, 15).map((entry, i) => {
                  const isCurrentPlayer = entry.id === "current";
                  const entryIsOwner = entry.name === OWNER_NAME;
                  return (
                    <motion.div
                      key={entry.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        isCurrentPlayer
                          ? "bg-saudi-emerald/20 border border-saudi-emerald/50 ring-2 ring-saudi-emerald/30"
                          : "bg-saudi-green/10 border border-saudi-emerald/15"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * Math.min(i, 10) }}
                    >
                      <span
                        className={`w-9 text-center font-bold text-lg ${
                          i === 0
                            ? "text-amber-400"
                            : i === 1
                              ? "text-slate-300"
                              : i === 2
                                ? "text-amber-600"
                                : "text-saudi-white/50"
                        }`}
                      >
                        {getMedalEmoji(i + 1)}
                      </span>

                      <div className="flex-1 text-right min-w-0">
                        <span className={`font-medium truncate block ${entryIsOwner ? "text-amber-400" : ""}`}>
                          {isCurrentPlayer ? entry.name + " (أنت)" : entry.name}
                          {entryIsOwner && <Crown className="w-4 h-4 inline-block mr-1 text-amber-400" />}
                        </span>
                        <span className="text-xs text-saudi-white/40">
                          {entry.correctAnswers}/20 · {entry.averageTime.toFixed(1)}s
                        </span>
                      </div>

                      <motion.span
                        className="font-bold tabular-nums text-saudi-emerald text-lg"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * Math.min(i, 10) + 0.3, type: "spring" }}
                      >
                        {formatScore(entry.score)}
                      </motion.span>

                      {isOwner && !isCurrentPlayer && (
                        <motion.button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1.5 rounded-lg hover:bg-saudi-red/20 text-saudi-red/60 hover:text-saudi-red transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Stage 7: Action buttons */}
          {stage >= 7 && (
            <motion.div
              key="actions"
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.button
                onClick={onRestart}
                onMouseEnter={playHover}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-saudi-emerald text-saudi-black font-bold text-lg rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,166,81,0.4)] hover:shadow-[0_0_50px_rgba(0,166,81,0.6)] transition-all duration-300"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  العب مرة أخرى
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-saudi-emerald/80 via-saudi-emerald to-saudi-emerald/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.button>

              <motion.button
                onClick={handleShare}
                onMouseEnter={playHover}
                className="relative inline-flex items-center gap-3 px-8 py-4 bg-saudi-green/30 border border-saudi-emerald/40 text-saudi-white font-bold text-lg rounded-full transition-all duration-300 hover:bg-saudi-green/50"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-5 h-5" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={showShare ? "copied" : "share"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {showShare ? "تم النسخ!" : "شارك نتيجتك"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
