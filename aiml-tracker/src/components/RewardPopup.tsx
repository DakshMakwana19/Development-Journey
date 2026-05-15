'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, createContext, useContext, useCallback, ReactNode } from 'react';

/**
 * RewardPopup — Animated reward notification system
 * Shows XP gained, coins, level-ups, and achievement unlocks with effects.
 */

interface RewardEvent {
  id: string;
  type: 'xp' | 'coins' | 'levelup' | 'achievement' | 'streak' | 'quest';
  title: string;
  subtitle?: string;
  icon: string;
  value?: number;
  color: string;
}

interface RewardContextType {
  showReward: (event: Omit<RewardEvent, 'id'>) => void;
  showXP: (xp: number, coins?: number) => void;
  showLevelUp: (level: number) => void;
  showAchievement: (title: string, icon: string) => void;
  showStreak: (days: number) => void;
}

const RewardContext = createContext<RewardContextType | null>(null);

export function useReward(): RewardContextType {
  const ctx = useContext(RewardContext);
  if (!ctx) throw new Error('useReward must be used within RewardProvider');
  return ctx;
}

export function RewardProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<RewardEvent[]>([]);

  const addEvent = useCallback((event: Omit<RewardEvent, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setEvents(prev => [...prev.slice(-4), { ...event, id }]);
    // Auto-remove after display
    setTimeout(() => {
      setEvents(prev => prev.filter(e => e.id !== id));
    }, 3500);
  }, []);

  const showReward = useCallback((event: Omit<RewardEvent, 'id'>) => addEvent(event), [addEvent]);

  const showXP = useCallback((xp: number, coins?: number) => {
    addEvent({
      type: 'xp',
      title: `+${xp} XP`,
      subtitle: coins ? `+${coins} coins` : undefined,
      icon: '⚡',
      value: xp,
      color: 'var(--accent-amber)',
    });
  }, [addEvent]);

  const showLevelUp = useCallback((level: number) => {
    addEvent({
      type: 'levelup',
      title: `Level ${level}!`,
      subtitle: 'You leveled up!',
      icon: '🎉',
      value: level,
      color: 'var(--accent-purple)',
    });
  }, [addEvent]);

  const showAchievement = useCallback((title: string, icon: string) => {
    addEvent({
      type: 'achievement',
      title: 'Achievement Unlocked!',
      subtitle: title,
      icon,
      color: 'var(--accent-teal)',
    });
  }, [addEvent]);

  const showStreak = useCallback((days: number) => {
    addEvent({
      type: 'streak',
      title: `${days} Day Streak!`,
      subtitle: 'Keep it going!',
      icon: '🔥',
      value: days,
      color: 'var(--accent-rose)',
    });
  }, [addEvent]);

  return (
    <RewardContext.Provider value={{ showReward, showXP, showLevelUp, showAchievement, showStreak }}>
      {children}
      {/* Render popups */}
      <div className="fixed top-4 right-4 z-50 flex flex-col" style={{ gap: '10px', pointerEvents: 'none' }}>
        <AnimatePresence>
          {events.map((event, idx) => (
            <RewardToast key={event.id} event={event} index={idx} />
          ))}
        </AnimatePresence>
      </div>
    </RewardContext.Provider>
  );
}

function RewardToast({ event, index }: { event: RewardEvent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.05 }}
      className="flex items-center pointer-events-auto"
      style={{
        padding: '14px 20px',
        gap: '14px',
        borderRadius: '14px',
        background: 'rgba(22, 27, 34, 0.95)',
        border: `1px solid ${event.color}40`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 20px ${event.color}20`,
        minWidth: '220px',
      }}
    >
      {/* Icon with glow */}
      <div
        className="flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: '42px',
          height: '42px',
          fontSize: '1.3rem',
          background: `${event.color}15`,
          boxShadow: `0 0 16px ${event.color}30`,
        }}
      >
        {event.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate" style={{ color: event.color, fontSize: '0.95rem' }}>
          {event.title}
        </p>
        {event.subtitle && (
          <p className="truncate" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: '2px' }}>
            {event.subtitle}
          </p>
        )}
      </div>
      {/* Animated particles for levelup/achievement */}
      {(event.type === 'levelup' || event.type === 'achievement') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '4px', height: '4px',
                background: event.color,
                left: `${20 + Math.random() * 60}%`,
                bottom: '0%',
              }}
              animate={{
                y: [0, -60 - Math.random() * 40],
                opacity: [1, 0],
                scale: [1, 0.3],
              }}
              transition={{
                duration: 1.2 + Math.random() * 0.5,
                delay: Math.random() * 0.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
