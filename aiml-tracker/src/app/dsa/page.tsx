'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Plus, Trash2, CheckCircle2, Circle, Filter, Trophy,
  ExternalLink, BookOpen, List, BarChart2,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import {
  DSAProblem, getDSAProblems, addDSAProblem, toggleDSAProblem,
  saveDSAProblems, generateId, addXP,
} from '@/lib/store';
import {
  DSA_SHEET, SHEET_TOPICS, getSheetSolved, toggleSheetProblem,
} from '@/lib/dsa-sheet';
import toast from 'react-hot-toast';

const TOPICS = ['Arrays', 'Strings', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'DP', 'Greedy', 'Backtracking', 'Binary Search', 'Hashing', 'Math'];

const DIFFICULTY_CONFIG = {
  easy: { color: 'var(--accent-green)', bg: 'rgba(126,231,135,0.1)', label: 'Easy' },
  medium: { color: 'var(--accent-amber)', bg: 'rgba(240,180,90,0.1)', label: 'Medium' },
  hard: { color: 'var(--accent-rose)', bg: 'rgba(242,122,142,0.1)', label: 'Hard' },
};

type TabType = 'sheet' | 'log' | 'analytics';

export default function DSAPage() {
  const [mounted, setMounted] = useState(false);
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [sheetSolved, setSheetSolved] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('sheet');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const [newProblem, setNewProblem] = useState({
    name: '', topic: 'Arrays', difficulty: 'medium' as DSAProblem['difficulty'],
    link: '', notes: '',
  });

  useEffect(() => {
    setMounted(true);
    setProblems(getDSAProblems());
    setSheetSolved(getSheetSolved());
  }, []);

  const analytics = useMemo(() => {
    const solved = problems.filter(p => p.solved);
    const byTopic = TOPICS.map(t => ({
      topic: t.length > 8 ? t.substring(0, 8) + '..' : t,
      solved: solved.filter(p => p.topic === t).length,
      total: problems.filter(p => p.topic === t).length,
    })).filter(t => t.total > 0);
    const byDifficulty = [
      { name: 'Easy', value: solved.filter(p => p.difficulty === 'easy').length, color: 'var(--accent-green)' },
      { name: 'Medium', value: solved.filter(p => p.difficulty === 'medium').length, color: 'var(--accent-amber)' },
      { name: 'Hard', value: solved.filter(p => p.difficulty === 'hard').length, color: 'var(--accent-rose)' },
    ];
    const heatmap: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 111; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      heatmap.push({ date: dateStr, count: solved.filter(p => p.date === dateStr).length });
    }
    return { solved: solved.length, total: problems.length, byTopic, byDifficulty, heatmap };
  }, [problems]);

  // Sheet analytics
  const sheetStats = useMemo(() => {
    const solvedCount = Object.values(sheetSolved).filter(Boolean).length;
    return { solved: solvedCount, total: DSA_SHEET.length, pct: Math.round((solvedCount / DSA_SHEET.length) * 100) };
  }, [sheetSolved]);

  if (!mounted) return null;

  const handleAdd = () => {
    if (!newProblem.name.trim()) { toast.error('Enter problem name'); return; }
    addDSAProblem({
      id: generateId(), name: newProblem.name, topic: newProblem.topic,
      difficulty: newProblem.difficulty, solved: true,
      date: new Date().toISOString().split('T')[0], link: newProblem.link, notes: newProblem.notes,
    });
    addXP(15);
    setProblems(getDSAProblems());
    setShowModal(false);
    setNewProblem({ name: '', topic: 'Arrays', difficulty: 'medium', link: '', notes: '' });
    toast.success('Problem logged! +15 XP');
  };

  const handleToggle = (id: string) => { toggleDSAProblem(id); setProblems(getDSAProblems()); };
  const handleDelete = (id: string) => { saveDSAProblems(problems.filter(p => p.id !== id)); setProblems(getDSAProblems()); };

  const handleSheetToggle = (id: string) => {
    const wasSolved = sheetSolved[id];
    const updated = toggleSheetProblem(id);
    setSheetSolved({ ...updated });
    if (!wasSolved) { addXP(15); toast.success('Problem solved! +15 XP 🎉'); }
  };

  const filteredSheet = DSA_SHEET.filter(p => {
    if (filterTopic !== 'all' && p.topic !== filterTopic) return false;
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    return true;
  });

  const filteredLog = problems.filter(p => {
    if (filterTopic !== 'all' && p.topic !== filterTopic) return false;
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    return true;
  });

  const getHeatColor = (count: number) => {
    if (count === 0) return 'var(--bg-elevated)';
    if (count === 1) return 'rgba(99,140,255,0.25)';
    if (count === 2) return 'rgba(99,140,255,0.45)';
    return 'rgba(99,140,255,0.7)';
  };

  const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'sheet', label: 'Problem Sheet', icon: <BookOpen size={15} /> },
    { key: 'log', label: 'My Log', icon: <List size={15} /> },
    { key: 'analytics', label: 'Analytics', icon: <BarChart2 size={15} /> },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="DSA Tracker"
        subtitle="Master data structures & algorithms with curated LeetCode problems"
        icon={<Code2 size={20} className="text-white" />}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Log Problem
          </button>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: '20px', marginBottom: '36px' }}>
        {[
          { label: 'Sheet Progress', value: `${sheetStats.solved}/${sheetStats.total}`, color: 'var(--accent-blue)' },
          { label: 'Custom Solved', value: analytics.solved, color: 'var(--accent-green)' },
          { label: 'Completion', value: `${sheetStats.pct}%`, color: 'var(--accent-purple)' },
          { label: 'Hard Solved', value: analytics.byDifficulty[2].value, color: 'var(--accent-rose)' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="card text-center" style={{ padding: '24px 20px' }}
          >
            <p className="font-bold" style={{ color: stat.color, fontSize: '1.5rem' }}>{stat.value}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '8px' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center w-fit rounded-xl" style={{ gap: '4px', padding: '6px', marginBottom: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="relative flex items-center rounded-lg font-medium transition-all duration-200"
            style={{ padding: '10px 22px', gap: '8px', fontSize: '0.9rem', color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
          >
            {activeTab === tab.key && (
              <motion.div layoutId="dsa-tab" className="absolute inset-0 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-primary)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center" style={{ gap: '8px' }}>{tab.icon}{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters (shared for sheet and log tabs) */}
      {(activeTab === 'sheet' || activeTab === 'log') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center" style={{ gap: '12px', marginBottom: '28px' }}>
          <Filter size={16} style={{ color: 'var(--text-tertiary)' }} />
          <select value={filterTopic} onChange={e => setFilterTopic(e.target.value)} style={{ width: 'auto', minWidth: '180px', fontSize: '0.875rem', padding: '10px 36px 10px 14px' }}>
            <option value="all">All Topics</option>
            {(activeTab === 'sheet' ? SHEET_TOPICS : TOPICS).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterDifficulty} onChange={e => setFilterDifficulty(e.target.value)} style={{ width: 'auto', minWidth: '170px', fontSize: '0.875rem', padding: '10px 36px 10px 14px' }}>
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </motion.div>
      )}

      {/* ═══════════ SHEET TAB ═══════════ */}
      <AnimatePresence mode="wait">
        {activeTab === 'sheet' && (
          <motion.div key="sheet" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Sheet progress bar */}
            <div className="card flex items-center" style={{ padding: '20px 24px', marginBottom: '28px', gap: '16px' }}>
              <div className="flex-1">
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <span className="font-medium" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {sheetStats.solved} of {sheetStats.total} problems solved
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                    {sheetStats.pct}%
                  </span>
                </div>
                <div className="w-full rounded-full" style={{ height: '8px', background: 'var(--bg-primary)' }}>
                  <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${sheetStats.pct}%` }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))' }}
                  />
                </div>
              </div>
            </div>

            {/* Group by topic */}
            {(() => {
              const topics = [...new Set(filteredSheet.map(p => p.topic))];
              return topics.map((topic, tIdx) => {
                const topicProblems = filteredSheet.filter(p => p.topic === topic);
                const topicSolved = topicProblems.filter(p => sheetSolved[p.id]).length;
                return (
                  <motion.div key={topic} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: tIdx * 0.05, duration: 0.35 }} style={{ marginBottom: '36px' }}
                  >
                    <div className="flex items-center justify-between" style={{ marginBottom: '14px', padding: '0 4px' }}>
                      <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>{topic}</h3>
                      <span className="font-medium rounded-full" style={{ fontSize: '0.78rem', padding: '4px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                        {topicSolved}/{topicProblems.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {topicProblems.map((p, idx) => {
                        const solved = sheetSolved[p.id];
                        const diff = DIFFICULTY_CONFIG[p.difficulty];
                        return (
                          <motion.div key={p.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: tIdx * 0.05 + idx * 0.02, duration: 0.3 }}
                            className="card flex items-center group transition-all duration-200"
                            style={{ padding: '14px 18px', gap: '14px', borderColor: solved ? 'rgba(126,231,135,0.15)' : undefined }}
                          >
                            <button onClick={() => handleSheetToggle(p.id)} className="shrink-0 transition-transform duration-200 hover:scale-110">
                              {solved ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : <Circle size={18} style={{ color: 'var(--text-tertiary)' }} />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate transition-colors duration-200" style={{
                                color: solved ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                textDecoration: solved ? 'line-through' : 'none',
                                fontSize: '0.9rem',
                              }}>
                                {p.name}
                              </p>
                            </div>
                            <span className="font-medium rounded-full shrink-0" style={{ fontSize: '0.72rem', padding: '3px 10px', background: diff.bg, color: diff.color }}>
                              {diff.label}
                            </span>
                            <a href={p.link} target="_blank" rel="noreferrer"
                              className="flex items-center shrink-0 opacity-60 group-hover:opacity-100 transition-all duration-200 rounded-md"
                              style={{ gap: '4px', fontSize: '0.75rem', padding: '5px 12px', background: 'var(--bg-tertiary)', color: 'var(--accent-blue)' }}
                            >
                              LeetCode <ExternalLink size={11} />
                            </a>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              });
            })()}
          </motion.div>
        )}

        {/* ═══════════ LOG TAB ═══════════ */}
        {activeTab === 'log' && (
          <motion.div key="log" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {filteredLog.length === 0 ? (
              <div className="text-center py-16">
                <Trophy size={40} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-3" />
                <p style={{ color: 'var(--text-secondary)' }}>No custom problems logged yet</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Use &ldquo;Log Problem&rdquo; to track extra practice</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredLog.map((p, idx) => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02, duration: 0.3 }} className="card p-3.5 flex items-center gap-3 group"
                  >
                    <button onClick={() => handleToggle(p.id)} className="shrink-0 transition-transform duration-200 hover:scale-110">
                      {p.solved ? <CheckCircle2 size={18} style={{ color: 'var(--success)' }} /> : <Circle size={18} style={{ color: 'var(--text-tertiary)' }} />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: p.solved ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: p.solved ? 'line-through' : 'none' }}>{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>{p.topic}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{p.date}</span>
                      </div>
                    </div>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="text-[11px] px-2 py-1 rounded-md opacity-60 group-hover:opacity-100 transition-all flex items-center gap-1"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-blue)' }}>
                        Link <ExternalLink size={10} />
                      </a>
                    )}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0" style={{ background: DIFFICULTY_CONFIG[p.difficulty].bg, color: DIFFICULTY_CONFIG[p.difficulty].color }}>
                      {p.difficulty}
                    </span>
                    <button onClick={() => handleDelete(p.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════ ANALYTICS TAB ═══════════ */}
        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '24px', marginBottom: '28px' }}>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card lg:col-span-2" style={{ padding: '24px' }}>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Problems by Topic</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={analytics.byTopic}>
                    <CartesianGrid stroke="var(--border-secondary)" strokeDasharray="3 3" />
                    <XAxis dataKey="topic" stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '12px' }} />
                    <Bar dataKey="solved" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="total" fill="var(--bg-hover)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '24px' }}>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Difficulty Split</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={analytics.byDifficulty} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {analytics.byDifficulty.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-primary)', borderRadius: '10px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {analytics.byDifficulty.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />{d.name}: {d.value}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            {/* Heatmap */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card" style={{ padding: '24px' }}>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '20px' }}>Coding Heatmap (16 Weeks)</h3>
              <div className="flex flex-wrap gap-[3px]">
                {analytics.heatmap.map(day => (
                  <div key={day.date} className="heatmap-cell w-[13px] h-[13px]" style={{ background: getHeatColor(day.count) }} title={`${day.date}: ${day.count}`} />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Less</span>
                {[0, 1, 2, 3].map(i => <div key={i} className="w-[13px] h-[13px] rounded-sm" style={{ background: getHeatColor(i) }} />)}
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>More</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Problem Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Log DSA Problem">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Problem Name</label>
            <input type="text" value={newProblem.name} onChange={e => setNewProblem({ ...newProblem, name: e.target.value })} placeholder="e.g., Two Sum" className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Topic</label>
              <select value={newProblem.topic} onChange={e => setNewProblem({ ...newProblem, topic: e.target.value })} className="w-full">
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Difficulty</label>
              <select value={newProblem.difficulty} onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value as DSAProblem['difficulty'] })} className="w-full">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>LeetCode Link (optional)</label>
            <input type="url" value={newProblem.link} onChange={e => setNewProblem({ ...newProblem, link: e.target.value })} placeholder="https://leetcode.com/problems/..." className="w-full" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes (optional)</label>
            <textarea value={newProblem.notes} onChange={e => setNewProblem({ ...newProblem, notes: e.target.value })} placeholder="Key insights..." className="w-full h-20 resize-none" />
          </div>
          <button onClick={handleAdd} className="btn-primary w-full mt-2">Log Problem</button>
        </div>
      </Modal>
    </AppLayout>
  );
}
