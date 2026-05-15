'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Flame,
  Award,
  CheckCircle2,
  Brain,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import ProgressRing from '@/components/ProgressRing';
import {
  getProfile,
  getStudySessions,
  getDailyLogs,
  getTasks,
  getDSAProblems,
  getGoals,
  getCommLogs,
} from '@/lib/store';
import { getOverallRoadmapCompletion, getRoadmapProgress } from '@/lib/roadmap-data';

/**
 * Analytics Page — Comprehensive study trends, consistency graphs,
 * focus analytics, productivity score, and habit tracking.
 */

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute all analytics once
  const data = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const profile = getProfile();
    const sessions = getStudySessions();
    const tasks = getTasks();
    const dsaProblems = getDSAProblems();
    const goals = getGoals();
    const commLogs = getCommLogs();
    const roadmapProgress = getRoadmapProgress();

    // --- Weekly study hours (last 4 weeks) ---
    const weeklyData: { week: string; hours: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      let totalHours = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().split('T')[0];
        totalHours += sessions.filter(s => s.date === dateStr).reduce((s, sess) => s + sess.hours, 0);
      }
      weeklyData.push({ week: `W${4 - w}`, hours: Number(totalHours.toFixed(1)) });
    }

    // --- Daily study hours (last 14 days) ---
    const dailyStudy: { day: string; hours: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayHours = sessions.filter(s => s.date === dateStr).reduce((s, sess) => s + sess.hours, 0);
      dailyStudy.push({ day: dateStr.slice(5), hours: Number(dayHours.toFixed(1)) });
    }

    // --- Task completion rate (last 7 days) ---
    const taskCompletion: { day: string; rate: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTasks = tasks.filter(t => t.date === dateStr);
      const rate = dayTasks.length > 0
        ? Math.round((dayTasks.filter(t => t.completed).length / dayTasks.length) * 100)
        : 0;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      taskCompletion.push({ day: dayName, rate });
    }

    // --- Focus areas radar ---
    const radarData = [
      { area: 'AI/ML', value: Math.min(100, getOverallRoadmapCompletion(roadmapProgress)) },
      { area: 'DSA', value: Math.min(100, dsaProblems.filter(p => p.solved).length * 2) },
      { area: 'Projects', value: Math.min(100, goals.filter(g => g.category === 'aiml').reduce((s, g) => s + g.progress, 0) / Math.max(1, goals.length)) },
      { area: 'Communication', value: Math.min(100, commLogs.length * 5) },
      { area: 'Consistency', value: Math.min(100, profile.streak * 5) },
      { area: 'Deep Work', value: Math.min(100, sessions.filter(s => s.hours >= 2).length * 10) },
    ];

    // --- Productivity score ---
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const streakScore = Math.min(100, profile.streak * 10);
    const hoursScore = Math.min(100, (profile.totalHoursStudied / 100) * 100);
    const productivityScore = Math.round((taskScore + streakScore + hoursScore) / 3);

    return {
      profile,
      weeklyData,
      dailyStudy,
      taskCompletion,
      radarData,
      productivityScore,
      stats: {
        totalHours: profile.totalHoursStudied,
        tasksCompleted: completedTasks,
        dsaSolved: dsaProblems.filter(p => p.solved).length,
        goalsActive: goals.length,
        streak: profile.streak,
        level: profile.level,
        commSessions: commLogs.length,
        roadmapCompletion: getOverallRoadmapCompletion(roadmapProgress),
      },
    };
  }, [mounted]);

  if (!mounted || !data) return null;

  return (
    <AppLayout>
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into your learning journey"
        icon={<BarChart3 size={20} className="text-white" />}
      />

      {/* Top Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Hours', value: data.stats.totalHours.toFixed(0), icon: <Clock size={18} />, color: 'var(--accent-blue)' },
          { label: 'Tasks Done', value: data.stats.tasksCompleted, icon: <CheckCircle2 size={18} />, color: 'var(--accent-green)' },
          { label: 'Current Streak', value: `${data.stats.streak}d`, icon: <Flame size={18} />, color: 'var(--accent-amber)' },
          { label: 'Level', value: data.stats.level, icon: <Award size={18} />, color: 'var(--accent-purple)' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card" style={{ padding: '22px' }}>
            <div className="rounded-xl flex items-center justify-center" style={{ width: '40px', height: '40px', background: `${stat.color}15`, color: stat.color, marginBottom: '10px' }}>
              {stat.icon}
            </div>
            <p className="font-bold" style={{ fontSize: '1.5rem', color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '24px', marginBottom: '32px' }}>
        {/* Daily Study Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card lg:col-span-2" style={{ padding: '28px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Study Hours (14 days)</h3>
            <TrendingUp size={16} style={{ color: 'var(--accent-green)' }} />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.dailyStudy}>
              <defs>
                <linearGradient id="gradStudy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="hours" stroke="var(--accent-blue)" strokeWidth={2} fill="url(#gradStudy)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Productivity Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card flex flex-col items-center justify-center" style={{ padding: '28px' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Productivity Score</h3>
          <ProgressRing
            progress={data.productivityScore}
            size={130}
            strokeWidth={10}
            color={
              data.productivityScore >= 70
                ? 'var(--accent-green)'
                : data.productivityScore >= 40
                ? 'var(--accent-amber)'
                : 'var(--accent-rose)'
            }
          />
          <p className="text-center" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '16px', maxWidth: '200px' }}>
            {data.productivityScore >= 70
              ? 'Outstanding consistency! Keep it up.'
              : data.productivityScore >= 40
              ? 'Good progress. Push a bit more.'
              : 'Build your streak to boost this score.'}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px', marginBottom: '32px' }}>
        {/* Weekly Study */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '28px' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Weekly Study Comparison</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.weeklyData}>
              <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="3 3" />
              <XAxis dataKey="week" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="hours" fill="var(--accent-purple)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Task Completion Rate */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card" style={{ padding: '28px' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Task Completion Rate (7 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.taskCompletion}>
              <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} stroke="var(--text-tertiary)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="rate" stroke="var(--accent-teal)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent-teal)' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Focus Radar + Achievements Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '28px' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Focus Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={data.radarData}>
              <PolarGrid stroke="var(--border-primary)" />
              <PolarAngleAxis dataKey="area" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
              <Radar dataKey="value" stroke="var(--accent-blue)" fill="var(--accent-blue)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Habit Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card" style={{ padding: '28px' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '24px' }}>Journey Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { label: 'Roadmap Completion', value: data.stats.roadmapCompletion, color: 'var(--accent-blue)', icon: <Brain size={16} /> },
              { label: 'DSA Problems', value: Math.min(100, data.stats.dsaSolved), color: 'var(--accent-purple)', icon: <Target size={16} /> },
              { label: 'Communication Sessions', value: Math.min(100, data.stats.commSessions * 3), color: 'var(--accent-teal)', icon: <CheckCircle2 size={16} /> },
              { label: 'Study Streak', value: Math.min(100, data.stats.streak * 5), color: 'var(--accent-amber)', icon: <Flame size={16} /> },
            ].map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  </div>
                  <span className="font-medium" style={{ fontSize: '0.78rem', color: item.color }}>{item.value}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    style={{ background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
