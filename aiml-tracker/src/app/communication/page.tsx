'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Mic,
  BookOpen,
  PenLine,
  Star,
  Flame,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import {
  CommunicationLog,
  getCommLogs,
  addCommLog,
  generateId,
  addXP,
} from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * Communication & Grammar Page — Track speaking practice, grammar exercises,
 * explanation skills, and confidence growth over time.
 */

const TYPE_CONFIG = {
  speaking: { icon: <Mic size={16} />, color: 'var(--accent-blue)', label: 'Speaking' },
  explanation: { icon: <MessageSquare size={16} />, color: 'var(--accent-purple)', label: 'Explanation' },
  grammar: { icon: <BookOpen size={16} />, color: 'var(--accent-teal)', label: 'Grammar' },
  writing: { icon: <PenLine size={16} />, color: 'var(--accent-amber)', label: 'Writing' },
};

const PROMPTS = {
  speaking: [
    'Explain how backpropagation works to a 5-year-old.',
    'Describe your favorite ML project in 2 minutes.',
    'Explain the difference between CNN and RNN.',
    'Give a 1-minute elevator pitch about your skills.',
    'Explain gradient descent without using technical jargon.',
    'Describe a technical challenge you solved recently.',
  ],
  grammar: [
    'Write 5 sentences using the passive voice correctly.',
    'Fix common errors: "Me and him went" → correction.',
    'Practice using: however, moreover, consequently.',
    'Write a paragraph with proper semicolon usage.',
    'Rewrite informal sentences into formal register.',
    'Practice subject-verb agreement with complex subjects.',
  ],
  explanation: [
    'Explain the bias-variance tradeoff to a non-technical person.',
    'Describe how a decision tree makes predictions.',
    'Walk through the steps of training a neural network.',
    'Explain why data normalization matters.',
    'Describe the concept of overfitting with a real-world analogy.',
    'Explain what transfer learning is and why it is useful.',
  ],
  writing: [
    'Write a README for your latest project.',
    'Summarize a research paper in 100 words.',
    'Write a professional email requesting feedback.',
    'Document a function with clear docstrings.',
    'Write a blog post outline about transformers.',
    'Create a technical specification for a new feature.',
  ],
};

export default function CommunicationPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activePromptType, setActivePromptType] = useState<keyof typeof PROMPTS>('speaking');
  const [currentPrompt, setCurrentPrompt] = useState('');

  const [form, setForm] = useState({
    type: 'speaking' as CommunicationLog['type'],
    duration: 15,
    rating: 3,
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
    setLogs(getCommLogs());
    randomizePrompt('speaking');
  }, []);

  const randomizePrompt = (type: keyof typeof PROMPTS) => {
    const list = PROMPTS[type];
    setCurrentPrompt(list[Math.floor(Math.random() * list.length)]);
    setActivePromptType(type);
  };

  // Derived analytics
  const analytics = useMemo(() => {
    const speakingLogs = logs.filter(l => l.type === 'speaking');
    const today = new Date().toISOString().split('T')[0];

    // Speaking streak
    let speakingStreak = 0;
    const sortedDates = [...new Set(speakingLogs.map(l => l.date))].sort().reverse();
    for (let i = 0; i < sortedDates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (sortedDates[i] === expected.toISOString().split('T')[0]) {
        speakingStreak++;
      } else break;
    }

    // Confidence trend (last 14 days average ratings)
    const trend: { date: string; rating: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLogs = logs.filter(l => l.date === dateStr);
      const avgRating = dayLogs.length > 0
        ? dayLogs.reduce((s, l) => s + l.rating, 0) / dayLogs.length
        : 0;
      trend.push({ date: dateStr.slice(5), rating: Number(avgRating.toFixed(1)) });
    }

    const totalPracticeMinutes = logs.reduce((s, l) => s + l.duration, 0);
    const avgRating = logs.length > 0
      ? (logs.reduce((s, l) => s + l.rating, 0) / logs.length).toFixed(1)
      : '0';

    return {
      total: logs.length,
      speakingStreak,
      totalPracticeMinutes,
      avgRating,
      trend,
      todayCount: logs.filter(l => l.date === today).length,
    };
  }, [logs]);

  if (!mounted) return null;

  const handleAdd = () => {
    const log: CommunicationLog = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      type: form.type,
      duration: form.duration,
      rating: form.rating,
      notes: form.notes,
    };
    addCommLog(log);
    addXP(10);
    setLogs(getCommLogs());
    setShowModal(false);
    setForm({ type: 'speaking', duration: 15, rating: 3, notes: '' });
    toast.success('Practice logged! +10 XP');
  };

  return (
    <AppLayout>
      <PageHeader
        title="Communication & Grammar"
        subtitle="Improve your speaking, writing, and technical communication"
        icon={<MessageSquare size={20} className="text-white" />}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Log Practice
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Sessions', value: analytics.total, color: 'var(--accent-blue)', icon: <MessageSquare size={16} /> },
          { label: 'Speaking Streak', value: `${analytics.speakingStreak}d`, color: 'var(--accent-amber)', icon: <Flame size={16} /> },
          { label: 'Practice Time', value: `${analytics.totalPracticeMinutes}m`, color: 'var(--accent-teal)', icon: <Mic size={16} /> },
          { label: 'Avg Rating', value: analytics.avgRating, color: 'var(--accent-purple)', icon: <Star size={16} /> },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card" style={{ padding: '22px' }}>
            <div className="flex items-center" style={{ gap: '10px', marginBottom: '10px' }}>
              <div className="rounded-lg flex items-center justify-center" style={{ width: '36px', height: '36px', background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            </div>
            <p className="font-bold" style={{ fontSize: '1.35rem', color: s.color }}>{s.value}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Syllabus Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="card" style={{ padding: '28px', marginBottom: '28px' }}>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '20px' }}>📚 Communication Syllabus</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '14px' }}>
          {[
            { title: 'Public Speaking', emoji: '🎤', color: 'var(--accent-blue)', topics: ['Voice modulation & projection', 'Stage presence & eye contact', 'Storytelling techniques', 'Handling nervousness', 'Impromptu speaking', 'Persuasive speech structure'] },
            { title: 'English Fluency', emoji: '🗣️', color: 'var(--accent-teal)', topics: ['Grammar fundamentals', 'Vocabulary building', 'Pronunciation & accent', 'Common idioms & phrases', 'Active vs passive voice', 'Tenses mastery'] },
            { title: 'Interview Prep', emoji: '💼', color: 'var(--accent-purple)', topics: ['STAR method answers', 'Technical interview', 'HR round preparation', 'Salary negotiation', 'Body language in interviews', 'Mock interview practice'] },
            { title: 'Body Language', emoji: '🧍', color: 'var(--accent-amber)', topics: ['Power poses', 'Hand gestures', 'Facial expressions', 'Confident walking', 'Mirroring techniques', 'Reading others\' body language'] },
            { title: 'Group Discussion', emoji: '👥', color: 'var(--accent-rose)', topics: ['Opening a GD', 'Making points clearly', 'Agreeing & disagreeing', 'Summarizing & closing', 'Active listening', 'Handling conflicts'] },
            { title: 'Writing Skills', emoji: '✍️', color: 'var(--accent-green)', topics: ['Email etiquette', 'Technical documentation', 'Blog post writing', 'Resume & cover letter', 'Formal vs informal tone', 'Proofreading techniques'] },
          ].map((mod, i) => (
            <div key={mod.title} className="rounded-xl" style={{ padding: '18px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
              <div className="flex items-center" style={{ gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>{mod.emoji}</span>
                <span className="font-semibold" style={{ fontSize: '0.88rem', color: mod.color }}>{mod.title}</span>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {mod.topics.map((topic, j) => (
                  <li key={j} className="flex items-center" style={{ gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <div className="shrink-0 rounded-full" style={{ width: '5px', height: '5px', background: mod.color, opacity: 0.6 }} />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '24px' }}>
        {/* Confidence Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card lg:col-span-2" style={{ padding: '28px' }}>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Confidence Trend (14 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.trend}>
              <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 5]} stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="rating" stroke="var(--accent-purple)" strokeWidth={2} dot={{ r: 3, fill: 'var(--accent-purple)' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Practice Prompt */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '28px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '18px' }}>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Practice Prompt</h3>
            <button onClick={() => randomizePrompt(activePromptType)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)' }}>
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Prompt type tabs */}
          <div className="flex" style={{ gap: '6px', marginBottom: '16px' }}>
            {(Object.keys(TYPE_CONFIG) as Array<keyof typeof TYPE_CONFIG>).map(type => {
              const cfg = TYPE_CONFIG[type];
              return (
                <button
                  key={type}
                  onClick={() => randomizePrompt(type)}
                  className="text-[10px] px-2 py-1 rounded-md transition-all"
                  style={{
                    background: activePromptType === type ? `${cfg.color}20` : 'var(--bg-tertiary)',
                    color: activePromptType === type ? cfg.color : 'var(--text-tertiary)',
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl" style={{ padding: '16px', marginBottom: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
            <p className="leading-relaxed" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {currentPrompt}
            </p>
          </div>

          <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            Practice this prompt, then log your session with a self-rating.
          </p>
        </motion.div>
      </div>

      {/* Recent Sessions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginTop: '28px' }}>
        <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '18px' }}>Recent Sessions</h3>
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <Mic size={36} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-3" />
            <p style={{ color: 'var(--text-secondary)' }}>No practice sessions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {logs.slice().reverse().slice(0, 20).map((log, idx) => {
              const cfg = TYPE_CONFIG[log.type];
              return (
                <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.02 }} className="card flex items-center" style={{ padding: '16px 18px', gap: '14px' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${cfg.color}15`, color: cfg.color }}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{cfg.label} Practice</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {log.duration}min · {log.date}
                      {log.notes && ` · ${log.notes}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill={i < log.rating ? 'var(--accent-amber)' : 'transparent'} style={{ color: i < log.rating ? 'var(--accent-amber)' : 'var(--text-tertiary)' }} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Log Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log Practice Session">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as CommunicationLog['type'] })} className="w-full">
              <option value="speaking">Speaking</option>
              <option value="explanation">Explanation</option>
              <option value="grammar">Grammar</option>
              <option value="writing">Writing</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Duration (min)</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: parseInt(e.target.value) || 0 })} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Self Rating (1-5)</label>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => setForm({ ...form, rating: i + 1 })} className="p-0.5">
                    <Star size={20} fill={i < form.rating ? 'var(--accent-amber)' : 'transparent'} style={{ color: i < form.rating ? 'var(--accent-amber)' : 'var(--text-tertiary)' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="What did you practice? How did it go?" className="w-full h-20 resize-none" />
          </div>
          <button onClick={handleAdd} className="btn-primary w-full mt-2">Log Session</button>
        </div>
      </Modal>
    </AppLayout>
  );
}
