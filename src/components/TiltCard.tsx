import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function TiltCard({ children, className = "", glowColor }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setStyle({
      rotateY: (x - 0.5) * 12,
      rotateX: (0.5 - y) * 12,
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleLeave = useCallback(() => {
    setStyle({ rotateX: 0, rotateY: 0 });
    setGlowPos({ x: 50, y: 50 });
  }, []);

  const defaultGlow = "hsl(var(--primary) / 0.15)";
  const glow = glowColor || defaultGlow;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={style}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className={`relative group ${className}`}
    >
      {/* Cursor-following glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, ${glow}, transparent 70%)`,
        }}
      />
      {/* Glassmorphism border glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at ${glowPos.x}% ${glowPos.y}%, hsl(var(--foreground) / 0.06), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
