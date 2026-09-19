import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Trophy, Users, Award, Timer, BookOpen, Crown, Target } from "lucide-react";
import { useGame } from "../context/game-context";
import { useAudio } from "../hooks/useAudio";
import BackgroundSystem from "./BackgroundSystem";

const statCards = [
  { value: "20", label: "سؤالًا", icon: Crown, color: "text-saudi-emerald", bgColor: "bg-saudi-emerald/20" },
  { value: "10–15", label: "ثانية", icon: Timer, color: "text-saudi-gold", bgColor: "bg-saudi-gold/20" },
  { value: "سرعة + دقة", label: "نظام النقاط", icon: Target, color: "text-saudi-emerald", bgColor: "bg-saudi-emerald/20" },
  { value: "🏆", label: "Leaderboard", icon: Award, color: "text-saudi-gold", bgColor: "bg-saudi-gold/20" },
];

const features = [
  {
    icon: Shield,
    title: "آمن وموثوق",
    description: "حماية كاملة لبياناتك وإجاباتك مع نظام تشفير متطور"
  },
  {
    icon: Zap,
    title: "وقت حقيقي",
    description: "تنافس في بيئة ديناميكية مع عد تنازلي دقيق وحد أقصى للإجابات"
  },
  {
    icon: Trophy,
    title: "تنافس عادل",
    description: "نظام نقاط عادل يعتمد على السرعة والدقة ومهارة الإجابة"
  },
  {
    icon: Users,
    title: "مجتمع عالمي",
    description: "انضم إلى آلاف اللاعبين من المملكة العربية السعودية وخارجها"
  },
  {
    icon: BookOpen,
    title: "أسئلة متنوعة",
    description: "مجموعة شاملة من الأسئلة حول اليوم الوطني السعودي تشمل التاريخ والثقافة والإنجازات"
  },
  {
    icon: Crown,
    title: "جوائز يومية",
    description: "كسب مكافآت يومية وتقدم في القائمة الخاصة"
  }
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
      <BackgroundSystem intensity={1} />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="relative z-20 p-6 md:p-8 flex items-center justify-between border-b border-saudi-emerald/20 bg-saudi-deep/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl glass-elevated flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <span className="text-2xl md:text-3xl">🇸🇦</span>
            </motion.div>
            <div>
              <p className="font-display font-bold text-xl md:text-2xl text-saudi-white">اليوم الوطني</p>
              <p className="text-xs md:text-sm text-saudi-white/50 font-medium tracking-widest uppercase">Saudi National Day Challenge</p>
            </div>
          </div>
          <motion.button 
            onClick={handleSoundToggle} 
            onMouseEnter={playHover}
            className="p-3 rounded-xl glass hover:glass-elevated transition-all duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={state.soundEnabled ? "إيقاف الصوت" : "تشغيل الصوت"}
          >
            {state.soundEnabled ? (
              <svg className="w-5 h-5 text-saudi-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-saudi-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </motion.button>
        </header>

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-10">
          <motion.div 
            className="relative z-10 w-full max-w-5xl text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              className="mb-8 flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                className="relative inline-flex items-center justify-center"
                style={{ filter: "drop-shadow(0 0 40px rgba(11, 140, 56, 0.4))" }}
              >
                <motion.div 
                  className="absolute -inset-4 rounded-full bg-gradient-to-r from-saudi-emerald/30 via-saudi-gold/30 to-saudi-emerald/30 blur-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative text-7xl md:text-9xl lg:text-[8rem] font-display">🇸🇦</span>
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="font-display font-bold text-4xl md:text-6xl lg:text-8xl xl:text-9xl leading-[1.1] tracking-tight mb-6 text-saudi-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="block">تحدّي</span>
              <span className="block text-gradient-gold">اليوم الوطني السعودي</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl text-saudi-white/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              اختبر معرفتك باليوم الوطني السعودي - 20 سؤالًا متخصصًا في التاريخ والثقافة والإنجازات والأرقام القياسية. أجيب بسرعة ودقة لتصل إلى القمة!
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {statCards.map((stat, i) => (
                <motion.div 
                  key={stat.label} 
                  className="group relative glass hover:glass-elevated p-5 md:p-6 rounded-2xl transition-all duration-500"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <motion.div 
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl glass flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stat.icon ? <stat.icon className="w-7 h-7 md:w-8 md:h-8" style={{ color: stat.color }} /> : <span className="text-3xl md:text-4xl">{stat.value}</span>}
                    </motion.div>
                    <div className="text-right">
                      <p className="font-display font-bold text-2xl md:text-3xl lg:text-4xl" style={{ color: stat.color }}>{stat.value}</p>
                      <p className="text-xs md:text-sm text-saudi-white/50 font-medium tracking-wider uppercase">{stat.label}</p>
                    </div>
                  </div>
                  <motion.div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-saudi-emerald/10 via-transparent to-saudi-gold/10 opacity-0 group-hover:opacity-100" 
                    transition={{ duration: 0.5 }} 
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.button 
              onClick={handleStart}
              onMouseEnter={playHover}
              className="group relative inline-flex items-center gap-4 px-12 py-5 md:px-16 md:py-6 bg-saudi-emerald text-saudi-deep font-bold text-lg md:text-xl rounded-full overflow-hidden shadow-[0_0_40px_rgba(11,140,56,0.5)] hover:shadow-[0_0_60px_rgba(11,140,56,0.7)] transition-all duration-500"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, y: -3, boxShadow: "0 0 80px rgba(11,140,56,0.6)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-3">ابدأ التحدي 
                <motion.div className="w-8 h-8 rounded-full bg-saudi-gold/20 flex items-center justify-center">
                  <motion.span className="w-5 h-5 text-saudi-gold" animate={{ x: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </motion.div>
              </span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-saudi-gold via-saudi-amber to-saudi-gold opacity-0 group-hover:opacity-100" 
                transition={{ duration: 0.5 }} 
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%]" 
                transition={{ duration: 0.8 }} 
              />
            </motion.button>
            
            <motion.p 
              className="mt-10 text-saudi-white/40 text-sm font-medium tracking-wider uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              بالاستمرار، أنت توافق على شروط الخدمة وسياسة الخصوصية
            </motion.p>
          </motion.div>
        </main>

        <section className="relative z-20 py-20 px-6 md:px-10 bg-gradient-to-b from-saudi-deep to-saudi-darker border-t border-saudi-emerald/20">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-16 text-saudi-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              لماذا تنضم إلى <span className="text-gradient-emerald">تحدي اليوم الوطني</span>؟
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
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saudi-emerald/20 to-saudi-gold/20 flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-saudi-emerald" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-saudi-white">{feature.title}</h3>
                    <p className="text-saudi-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-20 py-20 px-6 md:px-10">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-16 text-saudi-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              كيف <span className="text-gradient-gold">يعمل</span>؟
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step) => (
                <motion.div 
                  key={step.step}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: step.step * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saudi-emerald to-saudi-gold flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-2xl font-bold text-saudi-white">{step.step}</span>
                    </div>
                    {step.step < 4 && (
                      <div className="hidden lg:block absolute top-10 left-full w-20 h-0.5 bg-gradient-to-r from-saudi-emerald to-saudi-gold" />
                    )}
                  </div>
                  <h3 className="text-xl font-display font-bold text-saudi-white mb-3">{step.title}</h3>
                  <p className="text-saudi-white/70">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-20 py-20 px-6 md:px-10 bg-saudi-darker border-t border-saudi-emerald/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8 text-saudi-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              جاهز للتحدي؟
            </motion.h2>
            
            <motion.p 
              className="text-lg text-saudi-white/70 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              انضم إلى الآلاف من اللاعبين الذين يختبرون معرفتهم باليوم الوطني السعودي. كل إجابة صحيحة تقربك من القمة، وكل ثانية مهمة. هل أنت مستعد لتكون البطل؟
            </motion.p>
            
            <motion.button 
              onClick={handleStart}
              onMouseEnter={playHover}
              className="group relative inline-flex items-center gap-4 px-16 py-6 bg-saudi-emerald text-saudi-deep font-bold text-lg rounded-full overflow-hidden shadow-[0_0_50px_rgba(11,140,56,0.6)] hover:shadow-[0_0_80px_rgba(11,140,56,0.8)] transition-all duration-500"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">ابدأ الآن مجانًا</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-saudi-gold via-saudi-amber to-saudi-gold opacity-0 group-hover:opacity-100" 
                transition={{ duration: 0.5 }} 
              />
            </motion.button>
          </div>
        </section>

        <footer className="relative z-20 p-8 bg-saudi-black border-t border-saudi-emerald/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saudi-emerald to-saudi-gold flex items-center justify-center">
                  <span className="text-xl">🇸🇦</span>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-saudi-white">اليوم الوطني السعودي</p>
                  <p className="text-sm text-saudi-white/50">الإصدار 1.0.0 · جميع الحقوق محفوظة</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8 text-saudi-white/60">
                <span className="hover:text-saudi-emerald transition-colors cursor-pointer">حول</span>
                <span className="hover:text-saudi-emerald transition-colors cursor-pointer">الأسئلة الشائعة</span>
                <span className="hover:text-saudi-emerald transition-colors cursor-pointer">اتصل بنا</span>
                <span className="hover:text-saudi-emerald transition-colors cursor-pointer">شروط الخدمة</span>
                <span className="hover:text-saudi-emerald transition-colors cursor-pointer">سياسة الخصوصية</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}