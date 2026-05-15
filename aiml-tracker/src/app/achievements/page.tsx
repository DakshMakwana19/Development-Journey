'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { getAchievements, Achievement, ACHIEVEMENTS_DATA } from '@/lib/game-store';

/**
 * Achievements — View all unlockable achievements with progress.
 */

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  study: { label: 'Study', color: 'var(--accent-blue)' },
  dsa: { label: 'DSA', color: 'var(--accent-teal)' },
  fitness: { label: 'Fitness', color: 'var(--accent-rose)' },
  streak: { label: 'Streaks', color: 'var(--accent-amber)' },
  social: { label: 'Social', color: 'var(--accent-green)' },
  special: { label: 'Special', color: 'var(--accent-purple)' },
};

export default function AchievementsPage() {
  const [mounted, setMounted] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
    setAchievements(getAchievements());
  }, []);

  if (!mounted) return null;

  const filtered = filter === 'all' ? achievements : achievements.filter(a => a.category === filter);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

  return (
    <AppLayout>
      <PageHeader
        title="Achievements"
        subtitle={`${unlockedCount}/${achievements.length} unlocked — keep going!`}
        icon={<Trophy size={22} className="text-white" />}
      />

      {/* Unlock Progress */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="card" style={{ padding: '24px', marginBottom: '28px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
          <span className="font-medium" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Achievement Progress</span>
          <span className="font-bold font-mono" style={{ color: 'var(--accent-amber)', fontSize: '0.9rem' }}>
            {unlockedCount}/{achievements.length}
          </span>
        </div>
        <div className="w-full rounded-full" style={{ height: '8px', background: 'var(--bg-primary)' }}>
          <motion.div className="h-full rounded-full" initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            transition={{ duration: 1 }}
            style={{ background: 'linear-gradient(90deg, var(--accent-amber), var(--accent-rose))', boxShadow: '0 0 10px rgba(240,180,90,0.4)' }} />
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '24px' }}>
        {categories.map(cat => {
          const config = CATEGORY_LABELS[cat];
          const isActive = filter === cat;
          return (
            <button key={cat} onClick={() => setFilter(cat)}
              className="rounded-lg font-medium transition-all"
              style={{
                padding: '7px 14px', fontSize: '0.8rem',
                background: isActive ? (config?.color || 'var(--accent-blue)') : 'var(--bg-elevated)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'transparent' : 'var(--border-primary)'}`,
              }}>
              {cat === 'all' ? 'All' : config?.label}
            </button>
          );
        })}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '16px' }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((ach, idx) => {
            const catConfig = CATEGORY_LABELS[ach.category];
            return (
              <motion.div
                key={ach.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="card relative overflow-hidden group"
                style={{
                  padding: '24px',
                  opacity: ach.unlocked ? 1 : 0.55,
                  border: ach.unlocked ? `1px solid ${catConfig?.color || 'var(--accent-blue)'}30` : undefined,
                }}
              >
                {/* Unlocked glow */}
                {ach.unlocked && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: `radial-gradient(circle at 50% 0%, ${catConfig?.color || 'var(--accent-blue)'}10, transparent 70%)`,
                  }} />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between" style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '2rem' }}>{ach.icon}</span>
                    {ach.unlocked ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--accent-green)' }} />
                    ) : (
                      <Lock size={16} style={{ color: 'var(--text-tertiary)' }} />
                    )}
                  </div>
                  <h3 className="font-semibold" style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {ach.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: '12px', lineHeight: 1.5 }}>
                    {ach.description}
                  </p>
                  <div className="flex items-center" style={{ gap: '12px' }}>
                    <span className="font-mono font-semibold" style={{ fontSize: '0.72rem', color: 'var(--accent-amber)' }}>
                      +{ach.xpReward} XP
                    </span>
                    {ach.coinReward > 0 && (
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                        +{ach.coinReward} 🪙
                      </span>
                    )}
                    <span className="rounded-full ml-auto" style={{
                      fontSize: '0.65rem', padding: '2px 8px',
                      background: `${catConfig?.color || 'var(--accent-blue)'}15`,
                      color: catConfig?.color || 'var(--accent-blue)',
                      fontWeight: 500,
                    }}>
                      {catConfig?.label}
                    </span>
                  </div>
                  {ach.unlocked && ach.unlockedAt && (
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
