import { motion } from "framer-motion";

interface TimerProps {
  timeRemaining: number;
  timeLimit: number;
  phase: 1 | 2 | 3;
}

export function Timer({ timeRemaining, timeLimit, phase }: TimerProps) {
  const progress = timeRemaining / timeLimit;
  const isLow = timeRemaining <= 5;
  const isCritical = timeRemaining <= 3;
  const isDanger = timeRemaining <= 1;
  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference * (1 - progress);
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-28 h-28 md:w-32 md:h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="50"
            fill="none"
            stroke="rgba(0, 59, 36, 0.3)"
            strokeWidth="4"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="50"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            stroke={
              isDanger
                ? "#D94A11"
                : isCritical
                  ? "#F59E0B"
                  : isLow
                    ? "#FBBF24"
                    : "#00A651"
            }
            className={`transition-all duration-300 ${isCritical ? "animate-pulse" : ""} ${isDanger ? "animate-ping" : ""}`}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold text-3xl md:text-4xl tabular-nums ${isDanger ? "text-saudi-red" : isCritical ? "text-amber-400" : isLow ? "text-amber-300" : "text-saudi-emerald"}`}
            animate={{
              scale: isCritical ? [1, 1.15, 1] : isDanger ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: isCritical ? 0.5 : isDanger ? 0.3 : 0,
              repeat: isCritical || isDanger ? Infinity : 0,
            }}
          >
            {timeRemaining.toFixed(1)}
          </motion.span>
          <span className="text-xs md:text-sm text-saudi-white/60 font-medium tracking-wider">
            TIME LEFT
          </span>
        </div>
        <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-saudi-green border-2 border-saudi-emerald flex items-center justify-center">
          <span className="text-xs md:text-sm font-bold text-saudi-emerald">
            {phase}
          </span>
        </div>
      </div>
      <div className="w-48 h-2 bg-saudi-green/30 rounded-full mt-4 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isDanger
              ? "linear-gradient(90deg, #D94A11, #EF4444)"
              : isCritical
                ? "linear-gradient(90deg, #F59E0B, #FBBF24)"
                : isLow
                  ? "linear-gradient(90deg, #FBBF24, #00A651)"
                  : "linear-gradient(90deg, #00A651, #006C35)",
          }}
          animate={{ width: progress * 100 + "%" }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </div>
  );
}
