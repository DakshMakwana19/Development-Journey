'use client';

import { motion } from 'framer-motion';

/**
 * ProgressRing — Animated SVG circular progress indicator
 * Used across dashboard and goal cards for visual progress display
 */

interface ProgressRingProps {
  progress: number; // 0 – 100
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'var(--accent-blue)',
  bgColor = 'var(--bg-elevated)',
  label,
  sublabel,
  showPercentage = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && (
          <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {Math.round(progress)}%
          </span>
        )}
        {label && (
          <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
