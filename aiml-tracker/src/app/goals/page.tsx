'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Flag,
  Calendar,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import {
  Goal,
  Milestone,
  getGoals,
  saveGoals,
  addGoal,
  deleteGoal,
  updateGoal,
  generateId,
} from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * Goals Page — Track multiple goals with milestones, deadlines, and priorities.
 * Categories: AI/ML, DSA, Communication, Grammar, Fitness, Custom
 */

const CATEGORIES = [
  { value: 'aiml', label: 'AI/ML Roadmap', color: 'var(--accent-blue)' },
  { value: 'dsa', label: 'DSA Mastery', color: 'var(--accent-purple)' },
  { value: 'communication', label: 'Communication', color: 'var(--accent-teal)' },
  { value: 'grammar', label: 'Grammar', color: 'var(--accent-green)' },
  { value: 'fitness', label: 'Fitness & Habits', color: 'var(--accent-amber)' },
  { value: 'custom', label: 'Custom', color: 'var(--accent-rose)' },
];

const PRIORITY_COLORS = {
  high: 'var(--accent-rose)',
  medium: 'var(--accent-amber)',
  low: 'var(--accent-green)',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  // Form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'aiml' as Goal['category'],
    deadline: '',
    priority: 'medium' as Goal['priority'],
    milestones: '' // comma-separated
  });

  useEffect(() => {
    setMounted(true);
    setGoals(getGoals());
  }, []);

  if (!mounted) return null;

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }
    const milestones: Milestone[] = newGoal.milestones
      .split(',')
      .filter(m => m.trim())
      .map(m => ({
        id: generateId(),
        title: m.trim(),
        completed: false,
      }));

    const goal: Goal = {
      id: generateId(),
      title: newGoal.title,
      category: newGoal.category,
      progress: 0,
      milestones,
      deadline: newGoal.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      priority: newGoal.priority,
      createdAt: new Date().toISOString(),
    };

    addGoal(goal);
    setGoals(getGoals());
    setShowModal(false);
    setNewGoal({ title: '', category: 'aiml', deadline: '', priority: 'medium', milestones: '' });
    toast.success('Goal added!');
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map(m =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const completedCount = updatedMilestones.filter(m => m.completed).length;
    const progress = updatedMilestones.length > 0
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : 0;

    updateGoal(goalId, { milestones: updatedMilestones, progress });
    setGoals(getGoals());
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
    setGoals(getGoals());
    toast.success('Goal deleted');
  };

  const filtered = filter === 'all' ? goals : goals.filter(g => g.category === filter);
  const catConfig = (cat: string) => CATEGORIES.find(c => c.value === cat) || CATEGORIES[5];

  return (
    <AppLayout>
      <PageHeader
        title="Goals"
        subtitle="Track your milestones and stay on target"
        icon={<Target size={20} className="text-white" />}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Goal
          </button>
        }
      />

      {/* Category Filter */}
      <div className="flex flex-wrap" style={{ gap: '10px', marginBottom: '28px' }}>
        <button
          onClick={() => setFilter('all')}
          className="rounded-lg font-medium transition-all"
          style={{
            padding: '8px 16px',
            fontSize: '0.82rem',
            background: filter === 'all' ? 'var(--accent-blue)' : 'var(--bg-elevated)',
            color: filter === 'all' ? 'white' : 'var(--text-secondary)',
            border: '1px solid ' + (filter === 'all' ? 'var(--accent-blue)' : 'var(--border-primary)'),
          }}
        >
          All ({goals.length})
        </button>
        {CATEGORIES.map(cat => {
          const count = goals.filter(g => g.category === cat.value).length;
          return (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className="rounded-lg font-medium transition-all"
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                background: filter === cat.value ? cat.color : 'var(--bg-elevated)',
                color: filter === cat.value ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === cat.value ? cat.color : 'var(--border-primary)'}`,
              }}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Goals Grid */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <Target size={48} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-4" />
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
            No goals yet
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Create your first goal to start tracking progress
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px' }}>
          <AnimatePresence>
            {filtered.map((goal, idx) => {
              const cat = catConfig(goal.category);
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="card"
                  style={{ padding: '28px' }}
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                          style={{ background: `${cat.color}15`, color: cat.color }}
                        >
                          {cat.label}
                        </span>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{
                            background: `${PRIORITY_COLORS[goal.priority]}15`,
                            color: PRIORITY_COLORS[goal.priority],
                          }}
                        >
                          <Flag size={8} />
                          {goal.priority}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {goal.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--error)';
                        e.currentTarget.style.background = 'rgba(242,122,142,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '20px' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Progress</span>
                      <span className="text-xs font-medium" style={{ color: cat.color }}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ background: cat.color }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <span className="font-medium" style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem', display: 'block', marginBottom: '10px' }}>
                        Milestones
                      </span>
                      {goal.milestones.map(m => (
                        <button
                          key={m.id}
                          onClick={() => handleToggleMilestone(goal.id, m.id)}
                          className="flex items-center gap-2 w-full text-left py-1 group"
                        >
                          {m.completed ? (
                            <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                          ) : (
                            <Circle size={14} style={{ color: 'var(--text-tertiary)' }} className="group-hover:text-blue-400" />
                          )}
                          <span
                            className="text-sm transition-colors"
                            style={{
                              color: m.completed ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                              textDecoration: m.completed ? 'line-through' : 'none',
                            }}
                          >
                            {m.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <Calendar size={12} />
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Goal Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Goal">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Goal Title
            </label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              placeholder="e.g., Master Neural Networks"
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Category
              </label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                className="w-full"
              >
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Priority
              </label>
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                className="w-full"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Deadline
            </label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Milestones (comma-separated)
            </label>
            <input
              type="text"
              value={newGoal.milestones}
              onChange={(e) => setNewGoal({ ...newGoal, milestones: e.target.value })}
              placeholder="e.g., Learn basics, Build project, Deploy"
              className="w-full"
            />
          </div>
          <button onClick={handleAddGoal} className="btn-primary w-full mt-2">
            Create Goal
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
}
