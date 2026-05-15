'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Flame, Clock, CheckCircle2, Trophy,
  Lightbulb, TrendingUp, Star, Coins, Zap, Swords,
  ChevronRight, Target, Code2, Dumbbell, Route,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import XPBar from '@/components/XPBar';
import ParticleField from '@/components/ParticleField';
import Avatar from '@/components/Avatar';
import {
  getPlayerStats, getXPInCurrentLevel, getXPForNextLevel,
  getDailyQuests, Quest, getActivityLog,
} from '@/lib/game-store';
import {
  getProfile, getTasks, getStudySessions, getWeeklyStudyHours,
  getRandomQuote, getDSAProblems, getGoals,
} from '@/lib/store';

/**
 * Dashboard — Gamified home hub.
 * Hero section, daily quests, XP progress, stats, and quick navigation.
 */

const MENTOR_TIPS = [
  "Start your day with the hardest problem. You'll feel unstoppable after.",
  "Consistency beats intensity. 2 hours daily > 10 hours on weekends.",
  "Teach what you learn. Explaining cements understanding.",
  "Build projects alongside theory. Application is everything.",
  "Read one ML paper per week. It builds intuition over time.",
];

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const QUICK_NAV = [
  { href: '/dsa', label: 'DSA Practice', icon: Code2, color: 'var(--accent-teal)', desc: 'Solve problems' },
  { href: '/roadmap', label: 'AI/ML Roadmap', icon: Route, color: 'var(--accent-purple)', desc: 'Learn AI' },
  { href: '/gym', label: 'Gym', icon: Dumbbell, color: 'var(--accent-rose)', desc: 'Workout' },
  { href: '/goals', label: 'Goals', icon: Target, color: 'var(--accent-amber)', desc: 'Track goals' },
];

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [player, setPlayer] = useState(getPlayerStats());
  const [quests, setQuests] = useState<Quest[]>([]);
  const [weeklyHours, setWeeklyHours] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [todayTasks, setTodayTasks] = useState({ completed: 0, total: 0 });
  const [dsaSolved, setDsaSolved] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [mentorTip, setMentorTip] = useState('');

  useEffect(() => {
    setMounted(true);
    setQuote(getRandomQuote());
    setPlayer(getPlayerStats());
    setQuests(getDailyQuests());
    setWeeklyHours(getWeeklyStudyHours());
    setMentorTip(MENTOR_TIPS[Math.floor(Math.random() * MENTOR_TIPS.length)]);

    const today = new Date().toISOString().split('T')[0];
    const tasks = getTasks(today);
    setTodayTasks({ completed: tasks.filter(t => t.completed).length, total: tasks.length });
    setDsaSolved(getDSAProblems().filter(p => p.solved).length);
    setGoalCount(getGoals().length);
  }, []);

  if (!mounted) return null;

  const xpInLevel = getXPInCurrentLevel(player.xp);
  const xpForNext = getXPForNextLevel();
  const totalWeeklyHours = weeklyHours.reduce((s, h) => s + h, 0);
  const chartData = weeklyHours.map((hours, i) => ({ day: DAY_LABELS[i], hours }));
  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuest = quests.find(q => q.type === 'weekly');
  const questsCompleted = quests.filter(q => q.completed).length;

  return (
    <AppLayout>
      {/* Particle background */}
      <ParticleField count={30} />

      {/* ============ HERO SECTION ============ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl"
        style={{
          padding: '36px 40px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(99,140,255,0.12), rgba(167,139,250,0.08), rgba(94,234,212,0.05))',
          border: '1px solid rgba(99,140,255,0.15)',
        }}
      >
        {/* Background glow orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,140,255,0.1), transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent 70%)', transform: 'translate(-20%, 40%)' }} />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center" style={{ gap: '32px' }}>
          {/* Avatar Character */}
          <div className="hidden lg:block shrink-0">
            <Avatar size={100} autoEmote showLabel={false} />
          </div>

          <div className="flex-1">
            <div className="flex items-center" style={{ gap: '12px', marginBottom: '8px' }}>
              <h1 className="font-bold" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                Welcome back, {player.title.split(' ').pop()}!
              </h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '20px', maxWidth: '500px', lineHeight: 1.6 }}>
              You&apos;re a <strong className="gradient-text">{player.title}</strong>. Keep pushing to unlock new ranks and rewards.
            </p>
            {/* XP Bar */}
            <div style={{ maxWidth: '420px' }}>
              <XPBar xp={player.xp} xpInLevel={xpInLevel} xpForNext={xpForNext} level={player.level} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2" style={{ gap: '12px', minWidth: '280px' }}>
            {[
              { icon: Flame, label: 'Streak', value: `${player.streak} days`, color: 'var(--accent-amber)' },
              { icon: Coins, label: 'Coins', value: player.coins.toLocaleString(), color: 'var(--accent-amber)' },
              { icon: Zap, label: 'Total XP', value: player.xp.toLocaleString(), color: 'var(--accent-blue)' },
              { icon: Swords, label: 'Quests', value: `${questsCompleted}/${quests.length}`, color: 'var(--accent-teal)' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="rounded-xl"
                style={{
                  padding: '16px',
                  background: 'rgba(22,27,34,0.6)',
                  border: '1px solid var(--border-primary)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <stat.icon size={18} style={{ color: stat.color, marginBottom: '6px' }} />
                <p className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{stat.value}</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ============ MAIN GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '24px' }}>
        {/* ---- Left Column ---- */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Daily Quests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card" style={{ padding: '28px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <div className="rounded-xl flex items-center justify-center" style={{ width: '36px', height: '36px', background: 'rgba(94,234,212,0.12)' }}>
                  <Swords size={18} style={{ color: 'var(--accent-teal)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Daily Quests</h3>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>Complete for XP & coins</p>
                </div>
              </div>
              <span className="font-mono font-bold" style={{ fontSize: '0.85rem', color: questsCompleted === quests.length ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                {questsCompleted}/{quests.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dailyQuests.map((quest, i) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center rounded-xl"
                  style={{
                    padding: '14px 16px', gap: '14px',
                    background: quest.completed ? 'rgba(126,231,135,0.06)' : 'var(--bg-tertiary)',
                    border: `1px solid ${quest.completed ? 'rgba(126,231,135,0.15)' : 'transparent'}`,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{quest.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ fontSize: '0.88rem', color: quest.completed ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: quest.completed ? 'line-through' : 'none' }}>
                      {quest.title}
                    </p>
                    <p className="truncate" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {quest.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-semibold" style={{ fontSize: '0.72rem', color: 'var(--accent-amber)' }}>+{quest.xpReward} XP</p>
                    <p className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>+{quest.coinReward} 🪙</p>
                  </div>
                  {/* Progress bar */}
                  <div className="w-16 shrink-0">
                    <div className="rounded-full" style={{ height: '4px', background: 'var(--bg-primary)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%`, background: quest.completed ? 'var(--accent-green)' : 'var(--accent-blue)' }} />
                    </div>
                    <p className="text-center" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                      {quest.progress}/{quest.target}
                    </p>
                  </div>
                </motion.div>
              ))}
              {weeklyQuest && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center rounded-xl"
                  style={{
                    padding: '14px 16px', gap: '14px',
                    background: weeklyQuest.completed ? 'rgba(167,139,250,0.06)' : 'var(--bg-tertiary)',
                    border: `1px solid ${weeklyQuest.completed ? 'rgba(167,139,250,0.15)' : 'rgba(167,139,250,0.1)'}`,
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{weeklyQuest.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center" style={{ gap: '6px' }}>
                      <p className="font-medium truncate" style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>{weeklyQuest.title}</p>
                      <span className="rounded-full" style={{ fontSize: '0.6rem', padding: '1px 6px', background: 'rgba(167,139,250,0.15)', color: 'var(--accent-purple)', fontWeight: 600 }}>WEEKLY</span>
                    </div>
                    <p className="truncate" style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{weeklyQuest.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-semibold" style={{ fontSize: '0.72rem', color: 'var(--accent-purple)' }}>+{weeklyQuest.xpReward} XP</p>
                  </div>
                  <div className="w-16 shrink-0">
                    <div className="rounded-full" style={{ height: '4px', background: 'var(--bg-primary)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (weeklyQuest.progress / weeklyQuest.target) * 100)}%`, background: 'var(--accent-purple)' }} />
                    </div>
                    <p className="text-center" style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{weeklyQuest.progress}/{weeklyQuest.target}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Weekly Activity Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="card" style={{ padding: '28px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>Study Hours This Week</h3>
              <div className="flex items-center" style={{ gap: '6px' }}>
                <TrendingUp size={14} style={{ color: 'var(--accent-green)' }} />
                <span className="font-medium" style={{ color: 'var(--accent-green)', fontSize: '0.82rem' }}>{totalWeeklyHours.toFixed(1)}h</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '13px', padding: '10px 14px' }} />
                <Area type="monotone" dataKey="hours" stroke="var(--accent-blue)" strokeWidth={2} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* ---- Right Column ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Quick Nav Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '12px' }}>Quick Start</h3>
            <div className="grid grid-cols-2" style={{ gap: '10px' }}>
              {QUICK_NAV.map((item, i) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="card rounded-xl cursor-pointer group"
                    style={{ padding: '18px 16px' }}
                  >
                    <item.icon size={22} style={{ color: item.color, marginBottom: '10px' }} />
                    <p className="font-semibold" style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{item.label}</p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{item.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Overview Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="card" style={{ padding: '24px' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '16px' }}>Overview</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'DSA Solved', value: dsaSolved, color: 'var(--accent-teal)' },
                { label: 'Active Goals', value: goalCount, color: 'var(--accent-blue)' },
                { label: "Today's Tasks", value: `${todayTasks.completed}/${todayTasks.total}`, color: 'var(--accent-purple)' },
                { label: 'Hours This Week', value: totalWeeklyHours.toFixed(1), color: 'var(--accent-amber)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between" style={{ padding: '8px 0' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="font-bold font-mono" style={{ fontSize: '0.95rem', color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="card" style={{ padding: '24px' }}>
            <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
              <Star size={14} style={{ color: 'var(--accent-amber)' }} />
              <span className="font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', fontSize: '0.68rem' }}>Daily Inspiration</span>
            </div>
            <p className="italic leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              &ldquo;{quote.text}&rdquo;
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', marginTop: '8px' }}>— {quote.author}</p>
          </motion.div>

          {/* Mentor Tip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="card" style={{ padding: '24px' }}>
            <div className="flex items-center" style={{ gap: '8px', marginBottom: '12px' }}>
              <Lightbulb size={14} style={{ color: 'var(--accent-blue)' }} />
              <span className="font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', fontSize: '0.68rem' }}>Mentor Tip</span>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{mentorTip}</p>
          </motion.div>
        </div>
      </div>

      {/* ============ YOUR BUDDY - Interactive Avatar ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card"
        style={{ padding: '32px', marginTop: '28px', textAlign: 'center' }}
      >
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '4px' }}>
          Your Study Buddy
        </h3>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', marginBottom: '24px' }}>
          Click an emote to interact! 🎮
        </p>
        <AvatarPlayground />
      </motion.div>
    </AppLayout>
  );
}

/**
 * AvatarPlayground — Interactive emote selector for the avatar buddy.
 */
function AvatarPlayground() {
  const [emote, setEmote] = useState<'idle' | 'wave' | 'celebrate' | 'study' | 'flex' | 'sleep' | 'dance' | 'think'>('idle');

  const EMOTES = [
    { key: 'idle' as const, label: '😊 Chill', color: 'var(--accent-blue)' },
    { key: 'wave' as const, label: '👋 Wave', color: 'var(--accent-teal)' },
    { key: 'celebrate' as const, label: '🎉 Party', color: 'var(--accent-amber)' },
    { key: 'study' as const, label: '📖 Study', color: 'var(--accent-purple)' },
    { key: 'dance' as const, label: '🕺 Dance', color: 'var(--accent-rose)' },
    { key: 'flex' as const, label: '💪 Flex', color: 'var(--accent-green)' },
    { key: 'think' as const, label: '🤔 Think', color: 'var(--accent-blue)' },
    { key: 'sleep' as const, label: '😴 Sleep', color: 'var(--text-tertiary)' },
  ];

  return (
    <div className="flex flex-col items-center" style={{ gap: '20px' }}>
      <Avatar size={140} emote={emote} showLabel />
      <div className="flex flex-wrap justify-center" style={{ gap: '8px', maxWidth: '400px' }}>
        {EMOTES.map(e => (
          <motion.button
            key={e.key}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setEmote(e.key)}
            className="rounded-lg font-medium transition-all"
            style={{
              padding: '6px 14px',
              fontSize: '0.78rem',
              background: emote === e.key ? `${e.color}20` : 'var(--bg-tertiary)',
              color: emote === e.key ? e.color : 'var(--text-secondary)',
              border: `1px solid ${emote === e.key ? `${e.color}40` : 'var(--border-secondary)'}`,
            }}
          >
            {e.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
