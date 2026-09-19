import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  shape: "square" | "circle" | "strip";
}

const COLORS = ["#C9A227", "#00A651", "#F5F7F4", "#D94A11", "#ffffff", "#f59e0b"];

interface ConfettiProps {
  active: boolean;
  count?: number;
  originX?: number;
  originY?: number;
}

export function Confetti({
  active,
  count = 50,
  originX = 50,
  originY = 30,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    setPieces(
      Array.from({ length: count }, (_, id) => ({
        id,
        x: originX + (Math.random() - 0.5) * 20,
        y: originY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
        duration: Math.random() * 1.5 + 1.5,
        rotation: Math.random() * 720 - 360,
        shape: (["square", "circle", "strip"] as const)[
          Math.floor(Math.random() * 3)
        ],
      })),
    );
  }, [active, count, originX, originY]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          style={{
            position: "absolute",
            left: `${piece.x}%`,
            top: `${piece.y ?? originY}%`,
            width:
              piece.shape === "strip"
                ? piece.size * 0.4
                : piece.size,
            height:
              piece.shape === "strip"
                ? piece.size * 2
                : piece.shape === "circle"
                  ? piece.size
                  : piece.size,
            borderRadius: piece.shape === "circle" ? "50%" : "2px",
            backgroundColor: piece.color,
          }}
          initial={{
            opacity: 1,
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
          }}
          animate={{
            opacity: [1, 1, 0],
            y: [0, -200 - Math.random() * 300, 600],
            x: [(Math.random() - 0.5) * 400],
            rotate: piece.rotation,
            scale: [1, 1.2, 0.5],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
