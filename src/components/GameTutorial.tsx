import { motion } from "framer-motion";
import {
  BookOpen,
  ListOrdered,
  Check,
  Keyboard,
  Clock,
  Target,
  Zap,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { useAudio } from "../hooks/useAudio";
import type { GameMode } from "../types/game";

interface GameTutorialProps {
  gameMode: GameMode;
  onStart: () => void;
  onBack: () => void;
}

const TUTORIALS: Record<
  GameMode,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    borderColor: string;
    steps: { icon: React.ElementType; title: string; desc: string }[];
    tips: string[];
  }
> = {
  quiz: {
    title: "اختبار المعرفة",
    subtitle: "اختبر معلوماتك في اليوم الوطني السعودي",
    icon: BookOpen,
    color: "text-saudi-emerald",
    borderColor: "border-saudi-emerald/40",
    steps: [
      {
        icon: Target,
        title: "20 سؤال",
        desc: "أسئلة اختيار من متعدد عن التاريخ والثقافة السعودية",
      },
      {
        icon: Clock,
        title: "حدود الوقت",
        desc: "كل سؤال له وقت محدد — أسرع يجمع نقاط أكثر",
      },
      {
        icon: Zap,
        title: "نقاط السرعة",
        desc: "الإجابة السريعة تمنحك نقاط إضافية ومضاعفات",
      },
      {
        icon: Sparkles,
        title: "3 مراحل",
        desc: "سهل → متوسط → صعب. كل مرحلة أصعب من السابقة",
      },
    ],
    tips: [
      "فكّر بسرعة — الوقت يمر!",
      "السلسلة تضاعف النقاط",
      "لا تخمن عشوائيًا، الخطا يقصّر سلسلتك",
    ],
  },
  "sort-challenge": {
    title: "تحدي الترتيب",
    subtitle: "رتب العناصر في الترتيب الصحيح",
    icon: ListOrdered,
    color: "text-amber-400",
    borderColor: "border-saudi-gold/40",
    steps: [
      {
        icon: ListOrdered,
        title: "4 عناصر",
        desc: "سترى 4 عناصر يجب ترتيبها حسب التاريخ أو الأهمية",
      },
      {
        icon: Target,
        title: "اضغط بالترتيب",
        desc: "اضغط على العناصر بالترتيب الصحيح واحدًا تلو الآخر",
      },
      {
        icon: Clock,
        title: "20 ثانية",
        desc: "لديك 20 ثانية لكل سؤال — فكّر قبل أن تضغط",
      },
      {
        icon: Sparkles,
        title: "10 أسئلة",
        desc: "كل سؤال يختبر معرفتك بالترتيب الزمني أو الرتبي",
      },
    ],
    tips: [
      "افكر في الترتيب الزمني أولاً",
      "يمكنك إلغاء اختيار عنصر بالضغط عليه مجددًا",
      "العناصر الأقدم غالبًا تأتي أولاً",
    ],
  },
  "true-false": {
    title: "صح أم خطأ",
    subtitle: "هل هذه العبارة صحيحة أم خاطئة؟",
    icon: Check,
    color: "text-saudi-red",
    borderColor: "border-saudi-red/40",
    steps: [
      {
        icon: Check,
        title: "عبارة واحدة",
        desc: "سترى عبارة عن السعودية ويجب تحديد إن كانت صحيحة أم خاطئة",
      },
      {
        icon: Zap,
        title: "اضغط صح أو خطأ",
        desc: "اختر 'صح' إذا كانت العبارة صحيحة، 'خطأ' إذا كانت خاطئة",
      },
      {
        icon: Clock,
        title: "15 ثانية",
        desc: "لديك 15 ثانية لكل عبارة — لا تتأخر كثيرًا",
      },
      {
        icon: Target,
        title: "15 عبارة",
        desc: "كل عبارة تختبر معرفتك بحقائق اليوم الوطني",
      },
    ],
    tips: [
      "اقرأ العبارة بعناية قبل الإجابة",
      "بعض العبارات قد تكون خادعة",
      "السرعة مهمة لكن الدقة أهم",
    ],
  },
  "typing-challenge": {
    title: "تحدي الكتابة",
    subtitle: "اكتب الإجابة الصحيحة بأقل خطأ",
    icon: Keyboard,
    color: "text-amber-400",
    borderColor: "border-saudi-gold/40",
    steps: [
      {
        icon: Keyboard,
        title: "اكتب الإجابة",
        desc: "سترى سؤالاً ويجب كتابة الإجابة الصحيحة بالعربي",
      },
      {
        icon: Target,
        title: "إجابات مقبولة",
        desc: "هناك عدة صيغ مقبولة للإجابة — لا تحتاج لكتابة كل كلمة",
      },
      {
        icon: Clock,
        title: "20 ثانية",
        desc: "لديك 20 ثانية لكل سؤال — اكتب بأسرع ما يمكن",
      },
      {
        icon: Sparkles,
        title: "10 أسئلة",
        desc: "كل سؤال يختبر معرفتك الدقيقة بالتاريخ السعودي",
      },
    ],
    tips: [
      "لا تقلق من الكتابة بالعربي — النظام يفهم اللهجة",
      "اكتب كلمات مفتاحية فقط",
      "السرعة والدقة معاً يمنحك نقاط عالية",
    ],
  },
};

export function GameTutorial({ gameMode, onStart, onBack }: GameTutorialProps) {
  const { playClick } = useAudio();
  const tutorial = TUTORIALS[gameMode];
  const Icon = tutorial.icon;

  return (
    <motion.div
      className="app min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-saudi-green/10 to-saudi-black" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="tutorial-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#tutorial-grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Back button */}
        <motion.button
          onClick={() => { playClick(); onBack(); }}
          className="flex items-center gap-2 text-saudi-white/50 hover:text-saudi-white text-sm mb-6 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ x: 5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          تغيير التحدي
        </motion.button>

        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-saudi-emerald/20 to-saudi-gold/20 border-2 ${tutorial.borderColor} flex items-center justify-center`}>
            <Icon className={`w-10 h-10 ${tutorial.color}`} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-saudi-white mb-2">{tutorial.title}</h1>
          <p className="text-saudi-white/60">{tutorial.subtitle}</p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {tutorial.steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={i}
                className="flex items-start gap-4 p-4 bg-saudi-deep/60 border border-saudi-emerald/15 rounded-xl"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="w-10 h-10 rounded-lg bg-saudi-emerald/15 flex items-center justify-center flex-shrink-0">
                  <StepIcon className="w-5 h-5 text-saudi-emerald" />
                </div>
                <div>
                  <h3 className="text-saudi-white font-bold text-sm">{step.title}</h3>
                  <p className="text-saudi-white/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tips */}
        <motion.div
          className="mb-8 p-4 bg-saudi-gold/10 border border-saudi-gold/20 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-amber-400 font-bold text-sm mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            نصائح
          </h3>
          <ul className="space-y-1.5">
            {tutorial.tips.map((tip, i) => (
              <li key={i} className="text-saudi-white/60 text-sm flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Start button */}
        <motion.button
          onClick={() => { playClick(); onStart(); }}
          className="w-full py-4 bg-gradient-to-r from-saudi-emerald to-saudi-gold text-saudi-black font-bold text-lg rounded-xl hover:opacity-90 transition-opacity"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ابدأ اللعب
        </motion.button>
      </div>
    </motion.div>
  );
}
