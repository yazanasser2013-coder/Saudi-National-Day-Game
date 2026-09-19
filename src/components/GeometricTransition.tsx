import { motion, AnimatePresence } from "framer-motion";

interface GeometricTransitionProps {
  active: boolean;
  color?: "emerald" | "gold" | "red";
}

const colorMap = {
  emerald: { primary: "#0B8C38", secondary: "#14a840", glow: "rgba(11,140,56,0.4)" },
  gold: { primary: "#c9a227", secondary: "#d9b337", glow: "rgba(201,162,39,0.4)" },
  red: { primary: "#D94A11", secondary: "#ef4444", glow: "rgba(217,74,17,0.4)" },
};

export function GeometricTransition({ active, color = "emerald" }: GeometricTransitionProps) {
  const c = colorMap[color];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Diamond shape expanding from center */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: [0, 3, 0], rotate: [45, 225, 405] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div
              className="w-24 h-24 border-2"
              style={{
                borderColor: c.primary,
                boxShadow: `0 0 30px ${c.glow}`,
              }}
            />
          </motion.div>

          {/* Horizontal line sweep */}
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2"
            style={{ background: `linear-gradient(90deg, transparent, ${c.primary}, transparent)` }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          {/* Vertical line sweep */}
          <motion.div
            className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2"
            style={{ background: `linear-gradient(180deg, transparent, ${c.primary}, transparent)` }}
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          />

          {/* Corner accents */}
          {[
            { top: "10%", left: "10%", delay: 0.2 },
            { top: "10%", right: "10%", delay: 0.25 },
            { bottom: "10%", left: "10%", delay: 0.3 },
            { bottom: "10%", right: "10%", delay: 0.35 },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-8 h-8"
              style={{ ...pos, borderColor: c.primary }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: pos.delay }}
            >
              <div className="w-full h-full border-t-2 border-l-2 rotate-45" style={{ borderColor: c.primary }} />
            </motion.div>
          ))}

          {/* Flash overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: c.primary }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
