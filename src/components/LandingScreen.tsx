import { motion } from "framer-motion";
import { ArrowRight, Zap, Trophy, BookOpen, Volume2, VolumeX } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import BackgroundSystem from "./BackgroundSystem";
import HeroImg from "../assets/Hero-Img.png";

const features = [
  { icon: Zap, title: "وقت حقيقي", description: "تنافس في بيئة ديناميكية مع عد تنازلي دقيق وحد أقصى للإجابات" },
  { icon: Trophy, title: "تنافس عادل", description: "نظام نقاط عادل يعتمد على السرعة والدقة ومهارة الإجابة" },
  { icon: BookOpen, title: "أسئلة متنوعة", description: "مجموعة شاملة من الأسئلة حول اليوم الوطني السعودي تشمل التاريخ والثقافة والإنجازات" },
];

const howItWorks = [
  { step: 1, title: "الدخول", description: "ادخل باسمك وانضم إلى التحدي" },
  { step: 2, title: "اختيار", description: "اختر الإجابة الصحيحة من بين الخيارات المتاحة" },
  { step: 3, title: "الإجابة", description: "أجب بسرعة ودقة للفوز بالنقاط" },
  { step: 4, title: "اللوحات", description: "تابع تقدمك في لوحة المتصدرين الحية" },
];

export function LandingScreen() {
  const { goToJoin, toggleSound, state } = useGame();
  const { playClick, playHover } = useAudio();

  const handleStart = () => { playClick(); goToJoin(); };
  const handleSoundToggle = () => { playClick(); toggleSound(); };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <BackgroundSystem intensity={1.2} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.button
          onClick={handleSoundToggle}
          onMouseEnter={playHover}
          className="fixed top-6 left-6 z-50 p-3 rounded-xl glass hover:glass-elevated transition-all duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label={state.soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
        >
          {state.soundEnabled ? (
            <Volume2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-white/50" />
          )}
        </motion.button>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-10 min-h-screen">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover pointer-events-none"
            style={{ backgroundImage: `url(${HeroImg})`, opacity: 0.20 }}
          />
          <motion.div
            className="relative z-10 w-full max-w-5xl text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h1
              className="font-display font-bold text-3xl md:text-5xl lg:text-6xl mb-6 text-white whitespace-nowrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              تحدي اليوم الوطني السعودي
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              اختبر معرفتك باليوم الوطني السعودي - 20 سؤالًا متخصصًا في التاريخ والثقافة والإنجازات والأرقام القياسية. أجيب بسرعة ودقة لتصل إلى القمة!
            </motion.p>

            <motion.button
              onClick={handleStart}
              onMouseEnter={playHover}
              className="group relative inline-flex items-center gap-4 px-12 py-5 md:px-16 md:py-6 bg-emerald-600 text-white font-bold text-lg md:text-xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(11,140,56,0.5)] hover:shadow-[0_0_60px_rgba(11,140,56,0.7)] transition-all duration-500"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, y: -3, boxShadow: "0 0 80px rgba(11,140,56,0.6)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                ابدأ التحدي
                <motion.div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <motion.span className="w-5 h-5 text-amber-400" animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </motion.div>
              </span>
              <motion.div className="absolute inset-0 bg-linear-to-r from-amber-400 via-amber-300 to-amber-500 opacity-0 group-hover:opacity-100" transition={{ duration: 0.5 }} />
              <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%]" transition={{ duration: 0.8 }} />
            </motion.button>

            <motion.p
              className="mt-10 text-white/30 text-sm font-medium tracking-wider uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              بالاستمرار، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </motion.p>
          </motion.div>
        </main>

        <section className="relative z-20 py-20 px-6 md:px-10 bg-linear-to-b from-[#022623] to-[#052026] border-t border-emerald-900/20">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-16 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              لماذا تنضم إلى <span className="text-emerald-400">تحدي اليوم الوطني</span>؟
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="glass hover:glass-elevated p-8 rounded-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-18 h-18 rounded-2xl bg-linear-to-br from-emerald-500/20 to-amber-500/20 flex items-center justify-center relative">
                      <feature.icon className="w-9 h-9 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-20 py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-16 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              كيف <span className="text-amber-400">يعمل</span>؟
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="relative mb-6"
                    style={{ display: "inline-block" }}
                    initial={{ scale: 0.8, y: -10 }}
                    animate={{ scale: [0.8, 1.2, 1], y: [-10, 0] }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-emerald-500 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-display font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative z-20 p-8 bg-[#000000] border-t border-emerald-900/20">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-2">
            <p className="font-display font-bold text-lg text-white text-center">اليوم الوطني السعودي</p>
            <p className="text-sm text-white/50 text-center">الإصدار 1.0.0 · جميع الحقوق محفوظة</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
