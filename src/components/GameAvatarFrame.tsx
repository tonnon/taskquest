import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FrameRarity } from '@/utils/rankStyles';

interface GameAvatarFrameProps {
  avatarUrl?: string | null;
  frameSrc?: string | null; // URL for the specific frame PNG
  rarity?: FrameRarity;
  size?: number;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
  level?: number; // Optional level to display
}

const RARITY_CONFIG = {
  common: {
    color: '#94a3b8', // Slate 400
    glow: 'rgba(148, 163, 184, 0.5)',
    border: 'border-slate-400',
    gradient: 'from-slate-300 via-slate-500 to-slate-300',
  },
  rare: {
    color: '#3b82f6', // Blue 500
    glow: 'rgba(59, 130, 246, 0.6)',
    border: 'border-blue-500',
    gradient: 'from-blue-300 via-blue-600 to-blue-300',
  },
  epic: {
    color: '#a855f7', // Purple 500
    glow: 'rgba(168, 85, 247, 0.65)',
    border: 'border-purple-500',
    gradient: 'from-purple-300 via-purple-600 to-purple-300',
  },
  legendary: {
    color: '#eab308', // Yellow 500
    glow: 'rgba(234, 179, 8, 0.7)',
    border: 'border-yellow-500',
    gradient: 'from-yellow-200 via-yellow-500 to-yellow-200',
  },
};

const pulseVariant: Variants = {
  idle: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.05,
    filter: "brightness(1.2)",
    transition: { duration: 0.3 }
  }
};

const glowVariant: Variants = {
  idle: {
    boxShadow: [
      "0 0 10px var(--glow-color)",
      "0 0 20px var(--glow-color)",
      "0 0 10px var(--glow-color)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  hover: {
    boxShadow: "0 0 30px var(--glow-color), 0 0 15px var(--glow-color) inset",
    transition: { duration: 0.3 }
  }
};

const spinVariant: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 10,
      ease: "linear",
      repeat: Infinity
    }
  }
};

const Particle = ({ color, delay }: { color: string, delay: number }) => (
  <motion.div
    className="absolute rounded-full w-1 h-1 bg-white pointer-events-none z-20"
    initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: -20 - Math.random() * 20,
      x: (Math.random() - 0.5) * 30
    }}
    transition={{
      duration: 1.5,
      delay: delay,
      repeat: Infinity,
      ease: "easeOut"
    }}
    style={{
      boxShadow: `0 0 4px ${color}`,
      background: color,
      top: '85%',
      left: '50%'
    }}
  />
);

export const GameAvatarFrame = ({
  avatarUrl,
  frameSrc,
  rarity = 'common',
  size,
  animated = true,
  className,
  onClick,
  level
}: GameAvatarFrameProps) => {
  const config = RARITY_CONFIG[rarity];
  const isLegendary = rarity === 'legendary';

  // Fallback avatar if none provided
  const safeAvatarUrl = avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${level || 'user'}`;

  // CSS variables for dynamic coloring
  const style = {
    '--glow-color': config.glow,
    '--border-color': config.color,
    ...(size ? { width: size, height: size } : {}),
  } as React.CSSProperties;

  return (
    <motion.div
      className={cn("relative flex items-center justify-center rounded-full cursor-pointer select-none", className)}
      style={style}
      initial="idle"
      whileHover="hover"
      animate="idle"
      onClick={onClick}
    >
      {/* 1. Outer Glow / Aura */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-full z-0"
          variants={glowVariant}
          style={{ borderRadius: '50%' }}
        />
      )}

      {/* 2. Rotating Magic Ring (Epic/Legendary only) */}
      {(rarity === 'epic' || rarity === 'legendary') && animated && (
        <motion.div
          className="absolute -inset-2 rounded-full border border-dashed border-white/30 z-0 opacity-40"
          variants={spinVariant}
          animate="animate"
        />
      )}

      {/* 3. Avatar Container */}
      <div 
        className="relative z-10 w-[84%] h-[84%] rounded-full overflow-hidden bg-slate-900 border-2 border-black/50"
      >
        <img
          src={safeAvatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>

      {/* 4. Frame Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {frameSrc ? (
          // Use provided PNG frame
          <motion.img
            src={frameSrc}
            alt={`${rarity} frame`}
            className="w-[135%] h-[135%] object-contain max-w-none"
            variants={pulseVariant}
            style={{ filter: `drop-shadow(0 0 5px ${config.glow})` }}
          />
        ) : (
          // CSS Fallback Frame (Fantasy Style - Reference Match)
          <motion.div 
            className="absolute inset-0 z-0"
            variants={pulseVariant}
          >
            <svg 
              viewBox="0 0 100 100" 
              className="absolute inset-[-18%] w-[136%] h-[136%] pointer-events-none overflow-visible"
              style={{ filter: `drop-shadow(0 4px 3px rgba(0,0,0,0.4))` }}
            >
              <defs>
                <linearGradient id={`grad-${rarity}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={config.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={config.color} stopOpacity="1" />
                </linearGradient>
                {/* Clay/Matte Bevel Filter */}
                <filter id="clay-bevel">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                  <feSpecularLighting in="blur" surfaceScale="3" specularConstant="0.8" specularExponent="8" lightingColor="#ffffff" result="specOut">
                    <fePointLight x="-5000" y="-10000" z="10000" />
                  </feSpecularLighting>
                  <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                  <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" />
                </filter>
              </defs>

              {/* 1. Main Ring (Hand-Drawn/Clay Look) */}
              <path
                d="M 50 8 C 76 8, 92 24, 91 50 C 90 76, 76 92, 50 92 C 24 92, 8 76, 9 50 C 10 24, 24 8, 50 8 Z M 50 15 C 32 15, 17 31, 17 50 C 17 69, 32 85, 50 85 C 68 85, 83 69, 83 50 C 83 31, 68 15, 50 15 Z"
                fill={config.color}
                filter="url(#clay-bevel)"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
              />

              {/* 1b. Inner Rim (Metallic/Lighter Accent) - NEW */}
              <path
                d="M 50 15 C 32 15, 17 31, 17 50 C 17 69, 32 85, 50 85 C 68 85, 83 69, 83 50 C 83 31, 68 15, 50 15 Z"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="3"
                filter="url(#clay-bevel)"
                className="opacity-80"
              />

              {/* 2. Highlights (Hand-Painted feel) */}
              <path
                d="M 20 50 Q 20 20 50 20"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
                className="mix-blend-overlay"
              />

              {/* 3. Top Decoration (Varies by Rarity) */}
              {(rarity === 'common' || rarity === 'rare') ? (
                // Cat Ears / Horns Style (Refined)
                <path
                  d="M 25 25 Q 15 15 30 10 L 35 20 Z M 75 25 Q 85 15 70 10 L 65 20 Z"
                  fill={config.color}
                  filter="url(#clay-bevel)"
                  stroke="rgba(255,255,255,0.3)" 
                  strokeWidth="0.5"
                />
              ) : (
                // Royal Crown Style (Refined Spikes)
                <g>
                  <path
                    d="M 30 22 L 20 2 L 40 12 L 50 -5 L 60 12 L 80 2 L 70 22 Z"
                    fill={config.color}
                    filter="url(#clay-bevel)"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="0.5"
                  />
                  {/* Side Wings for Legendaries */}
                  {rarity === 'legendary' && (
                     <path 
                       d="M 10 40 L -2 30 L 12 50 Z M 90 40 L 102 30 L 88 50 Z"
                       fill={config.color}
                       filter="url(#clay-bevel)"
                     />
                  )}
                </g>
              )}

              {/* 4. Bottom Claws/Base */}
              <path
                d="M 32 88 Q 28 98 42 94 L 40 86 Z M 68 88 Q 72 98 58 94 L 60 86 Z"
                fill={config.color}
                filter="url(#clay-bevel)"
              />

              {/* 5. Embedded Gems */}
              {/* Bottom Center */}
              <circle cx="50" cy="90" r="3.5" fill={rarity === 'legendary' ? '#ef4444' : rarity === 'epic' ? '#ec4899' : '#3b82f6'} stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
              
              {/* Top Center (Crown only) */}
              {(rarity === 'epic' || rarity === 'legendary') && (
                <circle cx="50" cy="10" r="4.5" fill={rarity === 'legendary' ? '#ef4444' : rarity === 'epic' ? '#ec4899' : '#3b82f6'} stroke="rgba(255,255,255,0.8)" strokeWidth="1" />
              )}
            </svg>
          </motion.div>
        )}
      </div>

      {/* 5. Legendary Particles */}
      {isLegendary && animated && (
        <>
          <Particle color={config.color} delay={0} />
          <Particle color="#ffffff" delay={0.5} />
          <Particle color={config.color} delay={1.0} />
        </>
      )}

      {/* 6. Level Badge */}
      {level !== undefined && (
        <div className="absolute -bottom-[10%] z-30 flex justify-center w-full">
           <motion.div 
             className="px-2 py-0.5 rounded-full bg-black/80 border border-white/20 backdrop-blur-sm shadow-lg flex items-center gap-1"
             whileHover={{ scale: 1.1 }}
           >
              <span 
                className="text-xs font-bold font-mono"
                style={{ color: config.color, textShadow: `0 0 10px ${config.glow}` }}
              >
                {level}
              </span>
           </motion.div>
        </div>
      )}
    </motion.div>
  );
};
