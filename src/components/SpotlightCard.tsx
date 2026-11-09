import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(163, 0, 0, 0.18)',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCursorPos({ x: -1000, y: -1000 });
      }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d12] transition-colors ${className}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${cursorPos.x}px ${cursorPos.y}px, ${glowColor}, transparent 75%)`,
        }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};
