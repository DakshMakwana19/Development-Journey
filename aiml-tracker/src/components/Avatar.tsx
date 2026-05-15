'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Avatar — Animated pixel-art style boy character
 * Supports multiple emotes: idle, wave, celebrate, study, flex, sleep, dance
 * The character is built entirely with CSS/divs — no images needed.
 */

type Emote = 'idle' | 'wave' | 'celebrate' | 'study' | 'flex' | 'sleep' | 'dance' | 'think';

interface AvatarProps {
  size?: number;
  emote?: Emote;
  autoEmote?: boolean;
  showLabel?: boolean;
  className?: string;
}

const EMOTE_LABELS: Record<Emote, string> = {
  idle: '😊 Chilling',
  wave: '👋 Hey there!',
  celebrate: '🎉 Let\'s go!',
  study: '📖 Studying...',
  flex: '💪 Beast mode!',
  sleep: '😴 Zzz...',
  dance: '🕺 Vibing!',
  think: '🤔 Thinking...',
};

const AUTO_EMOTES: Emote[] = ['idle', 'wave', 'study', 'think', 'celebrate', 'dance', 'flex'];

export default function Avatar({ size = 120, emote = 'idle', autoEmote = false, showLabel = true, className = '' }: AvatarProps) {
  const [currentEmote, setCurrentEmote] = useState<Emote>(emote);

  useEffect(() => {
    if (!autoEmote) { setCurrentEmote(emote); return; }
    const cycle = () => {
      setCurrentEmote(AUTO_EMOTES[Math.floor(Math.random() * AUTO_EMOTES.length)]);
    };
    const interval = setInterval(cycle, 4000);
    return () => clearInterval(interval);
  }, [emote, autoEmote]);

  const scale = size / 120;

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ gap: `${6 * scale}px` }}>
      <motion.div
        className="relative"
        style={{ width: size, height: size * 1.35 }}
        animate={getBodyAnimation(currentEmote)}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        {/* === HEAD === */}
        <motion.div
          className="absolute rounded-2xl"
          style={{
            width: size * 0.52,
            height: size * 0.48,
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #FFD4A8, #FFBE8A)',
            borderRadius: `${16 * scale}px`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          animate={getHeadAnimation(currentEmote)}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          {/* Hair */}
          <div
            className="absolute rounded-t-2xl"
            style={{
              width: '110%',
              height: '45%',
              left: '-5%',
              top: '-8%',
              background: 'linear-gradient(135deg, #2D1B14, #4A2E20)',
              borderRadius: `${18 * scale}px ${18 * scale}px ${4 * scale}px ${4 * scale}px`,
              zIndex: 2,
            }}
          />
          {/* Hair fringe */}
          <div
            className="absolute"
            style={{
              width: '30%', height: '18%',
              right: '-2%', top: '5%',
              background: '#3D2317',
              borderRadius: `0 ${12 * scale}px ${8 * scale}px 0`,
              zIndex: 3,
            }}
          />

          {/* Eyes */}
          <AnimatePresence mode="wait">
            {currentEmote === 'sleep' ? (
              // Closed eyes
              <>
                <motion.div key="sleep-l" className="absolute" style={{ width: '14%', height: '2px', background: '#5D4037', left: '24%', top: '48%', borderRadius: '2px' }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} />
                <motion.div key="sleep-r" className="absolute" style={{ width: '14%', height: '2px', background: '#5D4037', right: '24%', top: '48%', borderRadius: '2px' }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} />
              </>
            ) : (
              <>
                {/* Left eye */}
                <motion.div
                  key="eye-l"
                  className="absolute rounded-full"
                  style={{ width: '16%', height: '18%', background: '#2D1B14', left: '22%', top: '42%' }}
                  animate={currentEmote === 'think' ? { x: [-1, 2] } : { scaleY: [1, 1, 0.1, 1] }}
                  transition={currentEmote === 'think' ? { duration: 2, repeat: Infinity, repeatType: 'reverse' } : { duration: 3, repeat: Infinity, times: [0, 0.85, 0.9, 1] }}
                >
                  {/* Eye shine */}
                  <div className="absolute rounded-full" style={{ width: '35%', height: '35%', background: 'white', top: '15%', left: '15%' }} />
                </motion.div>
                {/* Right eye */}
                <motion.div
                  key="eye-r"
                  className="absolute rounded-full"
                  style={{ width: '16%', height: '18%', background: '#2D1B14', right: '22%', top: '42%' }}
                  animate={currentEmote === 'think' ? { x: [-1, 2] } : { scaleY: [1, 1, 0.1, 1] }}
                  transition={currentEmote === 'think' ? { duration: 2, repeat: Infinity, repeatType: 'reverse' } : { duration: 3, repeat: Infinity, times: [0, 0.85, 0.9, 1] }}
                >
                  <div className="absolute rounded-full" style={{ width: '35%', height: '35%', background: 'white', top: '15%', left: '15%' }} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Mouth */}
          <motion.div
            className="absolute"
            style={{
              left: '50%',
              bottom: '18%',
              transform: 'translateX(-50%)',
              ...getMouthStyle(currentEmote, scale),
            }}
            animate={getMouthAnimation(currentEmote)}
            transition={{ duration: 0.4 }}
          />

          {/* Blush */}
          {(currentEmote === 'celebrate' || currentEmote === 'flex' || currentEmote === 'dance') && (
            <>
              <div className="absolute rounded-full" style={{ width: '14%', height: '8%', background: 'rgba(255,100,100,0.3)', left: '12%', top: '58%' }} />
              <div className="absolute rounded-full" style={{ width: '14%', height: '8%', background: 'rgba(255,100,100,0.3)', right: '12%', top: '58%' }} />
            </>
          )}
        </motion.div>

        {/* === BODY (SHIRT) === */}
        <motion.div
          className="absolute"
          style={{
            width: size * 0.55,
            height: size * 0.45,
            left: '50%',
            top: size * 0.42,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: `${8 * scale}px ${8 * scale}px ${14 * scale}px ${14 * scale}px`,
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
          }}
        >
          {/* Shirt collar */}
          <div className="absolute" style={{
            width: '40%', height: '15%', left: '30%', top: 0,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: `0 0 ${8 * scale}px ${8 * scale}px`,
          }} />
          {/* Shirt detail */}
          <div className="absolute" style={{ width: '3px', height: '50%', left: '50%', top: '15%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }} />
        </motion.div>

        {/* === LEFT ARM === */}
        <motion.div
          className="absolute"
          style={{
            width: size * 0.13,
            height: size * 0.38,
            left: size * 0.12,
            top: size * 0.45,
            background: 'linear-gradient(180deg, #6366F1, #7C3AED)',
            borderRadius: `${8 * scale}px`,
            transformOrigin: 'top center',
          }}
          animate={getLeftArmAnimation(currentEmote)}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          {/* Hand */}
          <div className="absolute rounded-full" style={{ width: '120%', height: '25%', left: '-10%', bottom: '-5%', background: '#FFD4A8' }} />
        </motion.div>

        {/* === RIGHT ARM === */}
        <motion.div
          className="absolute"
          style={{
            width: size * 0.13,
            height: size * 0.38,
            right: size * 0.12,
            top: size * 0.45,
            background: 'linear-gradient(180deg, #6366F1, #7C3AED)',
            borderRadius: `${8 * scale}px`,
            transformOrigin: 'top center',
          }}
          animate={getRightArmAnimation(currentEmote)}
          transition={{ duration: currentEmote === 'wave' ? 0.3 : 0.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <div className="absolute rounded-full" style={{ width: '120%', height: '25%', left: '-10%', bottom: '-5%', background: '#FFD4A8' }} />
        </motion.div>

        {/* === LEGS === */}
        <motion.div
          className="absolute flex"
          style={{
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            gap: `${4 * scale}px`,
          }}
        >
          <motion.div
            style={{
              width: size * 0.18,
              height: size * 0.32,
              background: 'linear-gradient(180deg, #374151, #1F2937)',
              borderRadius: `${4 * scale}px ${4 * scale}px ${6 * scale}px ${6 * scale}px`,
            }}
            animate={currentEmote === 'dance' ? { rotate: [-5, 5] } : { y: [0, -1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            {/* Shoe */}
            <div className="absolute bottom-0 w-full rounded-b-lg" style={{ height: '22%', background: '#EF4444', borderRadius: `0 0 ${6 * scale}px ${6 * scale}px` }} />
          </motion.div>
          <motion.div
            style={{
              width: size * 0.18,
              height: size * 0.32,
              background: 'linear-gradient(180deg, #374151, #1F2937)',
              borderRadius: `${4 * scale}px ${4 * scale}px ${6 * scale}px ${6 * scale}px`,
            }}
            animate={currentEmote === 'dance' ? { rotate: [5, -5] } : { y: [0, -1, 0] }}
            transition={{ duration: 0.5, delay: 0.15, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="absolute bottom-0 w-full rounded-b-lg" style={{ height: '22%', background: '#EF4444', borderRadius: `0 0 ${6 * scale}px ${6 * scale}px` }} />
          </motion.div>
        </motion.div>

        {/* === EMOTE EFFECTS === */}
        {currentEmote === 'celebrate' && (
          <>
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute rounded-full"
                style={{
                  width: 4 * scale, height: 4 * scale,
                  background: ['#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899'][i],
                  left: `${20 + i * 15}%`, top: '10%',
                }}
                animate={{ y: [0, -20 - Math.random() * 30], opacity: [1, 0], scale: [1, 0.3] }}
                transition={{ duration: 1, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.5 }}
              />
            ))}
          </>
        )}

        {currentEmote === 'study' && (
          <motion.div className="absolute" style={{ right: 0, top: '20%', fontSize: `${14 * scale}px` }}
            animate={{ y: [0, -3], opacity: [0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}>
            📖
          </motion.div>
        )}

        {currentEmote === 'sleep' && (
          <motion.div className="absolute" style={{ right: '-5%', top: '5%', fontSize: `${16 * scale}px`, fontWeight: 700, color: 'var(--text-tertiary)' }}
            animate={{ y: [0, -8], opacity: [1, 0], scale: [0.8, 1.2] }}
            transition={{ duration: 2, repeat: Infinity }}>
            Z
          </motion.div>
        )}

        {currentEmote === 'think' && (
          <>
            <motion.div className="absolute rounded-full" style={{ right: '-2%', top: '8%', width: 6 * scale, height: 6 * scale, background: 'var(--text-tertiary)', opacity: 0.4 }}
              animate={{ y: [0, -6], opacity: [0.3, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }} />
            <motion.div className="absolute rounded-full" style={{ right: '-8%', top: '0%', width: 10 * scale, height: 10 * scale, background: 'var(--text-tertiary)', opacity: 0.3 }}
              animate={{ y: [0, -8], opacity: [0.2, 0.5] }} transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatType: 'reverse' }} />
          </>
        )}

        {currentEmote === 'flex' && (
          <motion.div className="absolute" style={{ left: '-8%', top: '30%', fontSize: `${12 * scale}px` }}
            animate={{ scale: [0.8, 1.2], rotate: [-10, 10] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatType: 'reverse' }}>
            💪
          </motion.div>
        )}
      </motion.div>

      {/* Emote label */}
      {showLabel && (
        <AnimatePresence mode="wait">
          <motion.p
            key={currentEmote}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            style={{ fontSize: `${11 * scale}px`, color: 'var(--text-tertiary)', fontWeight: 500, textAlign: 'center' }}
          >
            {EMOTE_LABELS[currentEmote]}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}

// === ANIMATION HELPERS ===

function getBodyAnimation(emote: Emote) {
  switch (emote) {
    case 'dance': return { y: [0, -4, 0], rotate: [-2, 2] };
    case 'celebrate': return { y: [0, -6, 0] };
    case 'flex': return { y: [0, -2, 0], scale: [1, 1.03, 1] };
    default: return { y: [0, -2, 0] };
  }
}

function getHeadAnimation(emote: Emote) {
  switch (emote) {
    case 'wave': return { rotate: [0, 3, -3, 0] };
    case 'dance': return { rotate: [-5, 5] };
    case 'think': return { rotate: [0, 5], x: [0, 2] };
    case 'sleep': return { rotate: [0, 5] };
    default: return { rotate: [0, 1, 0] };
  }
}

function getMouthStyle(emote: Emote, scale: number) {
  switch (emote) {
    case 'celebrate':
    case 'dance':
      return { width: `${14 * scale}px`, height: `${8 * scale}px`, background: '#D4845A', borderRadius: `0 0 ${8 * scale}px ${8 * scale}px` };
    case 'sleep':
      return { width: `${8 * scale}px`, height: `${8 * scale}px`, background: 'transparent', border: '2px solid #D4845A', borderRadius: '50%' };
    case 'flex':
      return { width: `${12 * scale}px`, height: `${5 * scale}px`, background: '#D4845A', borderRadius: `0 0 ${6 * scale}px ${6 * scale}px` };
    case 'think':
      return { width: `${6 * scale}px`, height: `${3 * scale}px`, background: '#C4785A', borderRadius: `${4 * scale}px` };
    default:
      return { width: `${10 * scale}px`, height: `${4 * scale}px`, background: '#C4785A', borderRadius: `0 0 ${6 * scale}px ${6 * scale}px` };
  }
}

function getMouthAnimation(emote: Emote) {
  if (emote === 'celebrate') return { scaleY: [1, 1.3, 1] };
  if (emote === 'sleep') return { scale: [0.8, 1.1, 0.8] };
  return {};
}

function getLeftArmAnimation(emote: Emote) {
  switch (emote) {
    case 'flex': return { rotate: [-80, -90] };
    case 'celebrate': return { rotate: [-50, -70] };
    case 'dance': return { rotate: [-40, 10] };
    case 'study': return { rotate: [-20, -25] };
    default: return { rotate: [0, 3] };
  }
}

function getRightArmAnimation(emote: Emote) {
  switch (emote) {
    case 'wave': return { rotate: [-60, -80] };
    case 'flex': return { rotate: [80, 90] };
    case 'celebrate': return { rotate: [50, 70] };
    case 'dance': return { rotate: [40, -10] };
    case 'study': return { rotate: [20, 25] };
    default: return { rotate: [0, -3] };
  }
}
