import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion"; import { useEffect, useMemo } from "react";

interface BackgroundSystemProps {
  intensity?: number;
  showGrid?: boolean;
  showParticles?: boolean;
  showScanlines?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

interface GlassOrbProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  size: number;
  color: string;
  blur: number;
  delay: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 12 + 8,
    delay: Math.random() * 8,
    driftX: (Math.random() - 0.5) * 80,
    driftY: (Math.random() - 0.5) * 80,
  }));
}

function GlassOrb({
  x,
  y,
  size,
  color,
  blur,
  delay,
}: GlassOrbProps) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        left: "50%",
        top: "50%",
        x,
        y,
        width: size,
        height: size,
        background: `radial-gradient(circle at 40% 40%, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        scale: [1, 1.08, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

function ParticlesLayer({ intensity }: { intensity: number }) {
  const particles = useMemo(
    () => createParticles(Math.round(45 * intensity)),
    [intensity],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-emerald-300/70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: particle.driftX,
            y: particle.driftY,
            opacity: [0.15, 0.6, 0.15],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function GridLayer({ intensity }: { intensity: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 opacity-30"
      style={{
        opacity: 0.2 * intensity,
        backgroundImage: `
          linear-gradient(
            rgba(0, 166, 81, 0.16) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(0, 166, 81, 0.16) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "64px 64px",
        maskImage:
          "radial-gradient(ellipse at center, black 0%, transparent 75%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 0%, transparent 75%)",
      }}
      animate={{
        backgroundPosition: ["0px 0px", "64px 64px"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.035]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.35) 4px)",
        maskImage:
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
      }}
    />
  );
}

export default function BackgroundSystem({
  intensity = 1,
  showGrid = true,
  showParticles = true,
  showScanlines = true,
}: BackgroundSystemProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const orb1X = useSpring(mouseX, {
    stiffness: 30,
    damping: 20,
    mass: 1,
  });

  const orb1Y = useSpring(mouseY, {
    stiffness: 30,
    damping: 20,
    mass: 1,
  });

  const orb2X = useSpring(mouseX, {
    stiffness: 20,
    damping: 25,
    mass: 1,
  });

  const orb2Y = useSpring(mouseY, {
    stiffness: 20,
    damping: 25,
    mass: 1,
  });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 120;
      const y = (event.clientY / window.innerHeight - 0.5) * 120;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#020b07]">
      {/* Base atmospheric gradients */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              circle at 50% 0%,
              rgba(0, 166, 81, ${0.16 * intensity}) 0%,
              transparent 45%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(0, 59, 36, ${0.3 * intensity}) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 0% 100%,
              rgba(201, 162, 39, ${0.07 * intensity}) 0%,
              transparent 40%
            )
          `,
        }}
      />

      {/* Animated green orb */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          x: orb1X,
          y: orb1Y,
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          background:
            "radial-gradient(circle at 40% 40%, rgba(0,166,81,0.32), transparent 65%)",
          backgroundSize: "120% 120%",
        }}
      />

      {/* Glass orbs */}
      <GlassOrb
        x={orb1X}
        y={orb1Y}
        size={600}
        color="rgba(0, 166, 81, 0.22)"
        blur={90}
        delay={0}
      />

      <GlassOrb
        x={orb2X}
        y={orb2Y}
        size={400}
        color="rgba(0, 59, 36, 0.28)"
        blur={75}
        delay={2}
      />

      <GlassOrb
        x={orb2X}
        y={orb1Y}
        size={300}
        color="rgba(201, 162, 39, 0.12)"
        blur={65}
        delay={4}
      />

      {/* Large atmospheric glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,166,81,0.08) 0%, transparent 68%)",
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {showGrid && <GridLayer intensity={intensity} />}

      {showParticles && <ParticlesLayer intensity={intensity} />}

      {showScanlines && <Scanlines />}

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Top highlight */}
      <div
        className="absolute left-1/2 top-0 h-75 w-[75%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,166,81,0.12), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Bottom gold accent */}
      <motion.div
        className="absolute -bottom-37.5 left-1/2 h-75 w-[60%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,162,39,0.06), transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}