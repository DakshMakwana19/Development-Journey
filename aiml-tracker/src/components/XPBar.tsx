'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

/**
 * XPBar — Animated experience point progress bar
 * Shows current XP, level, and animated fill with glow effect.
 */

interface XPBarProps {
  xp: number;
  xpInLevel: number;
  xpForNext: number;
  level: number;
  compact?: boolean;
}

export default function XPBar({ xp, xpInLevel, xpForNext, level, compact = false }: XPBarProps) {
  const pct = Math.min(100, (xpInLevel / xpForNext) * 100);

  if (compact) {
    return (
      <div className="flex items-center" style={{ gap: '8px' }}>
        <div className="flex items-center" style={{ gap: '4px' }}>
          <Zap size={12} style={{ color: 'var(--accent-amber)' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Lv.{level}
          </span>
        </div>
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'var(--bg-primary)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              background: 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))',
              boxShadow: '0 0 8px rgba(240,180,90,0.4)',
            }}
          />
        </div>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          {xpInLevel}/{xpForNext}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{
              width: '32px', height: '32px',
              background: 'linear-gradient(135deg, var(--accent-amber), var(--accent-rose))',
              boxShadow: '0 0 16px rgba(240,180,90,0.3)',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{level}</span>
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Level {level}
            </p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
              {xp.toLocaleString()} Total XP
            </p>
          </div>
        </div>
        <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
          {xpInLevel}/{xpForNext} XP
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: '10px', background: 'var(--bg-primary)' }}>
        <motion.div
          className="h-full rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            background: 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))',
            boxShadow: '0 0 12px rgba(240,180,90,0.5)',
          }}
        >
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
