'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Flag,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import {
  Task,
  getTasks,
  saveTasks,
  addTask,
  toggleTask,
  deleteTask,
  generateId,
  getPlannerNotes,
  savePlannerNotes,
  getSettings,
  addXP,
  addStudySession,
} from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * Daily Planner — Task management with Pomodoro timer and notes.
 * Features: tasks with priorities, time estimates, Pomodoro, daily notes.
 */

const PRIORITY_CONFIG = {
  high: { color: 'var(--accent-rose)', label: 'High' },
  medium: { color: 'var(--accent-amber)', label: 'Medium' },
  low: { color: 'var(--accent-green)', label: 'Low' },
};

const CATEGORIES = ['Study', 'DSA', 'Project', 'Reading', 'Exercise', 'Other'];

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Pomodoro state
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // New task form
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium' as Task['priority'],
    timeEstimate: 30,
    category: 'Study',
  });

  useEffect(() => {
    setMounted(true);
    const settings = getSettings();
    setPomodoroMinutes(settings.pomodoroWork);
  }, []);

  useEffect(() => {
    const dateTasks = getTasks(selectedDate);
    setTasksState(dateTasks);
    setNotes(getPlannerNotes(selectedDate));
  }, [selectedDate]);

  // Pomodoro timer logic
  const resetTimer = useCallback(() => {
    const settings = getSettings();
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setPomodoroMinutes(isBreak ? settings.pomodoroBreak : settings.pomodoroWork);
    setPomodoroSeconds(0);
  }, [isBreak]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setPomodoroSeconds(prev => {
        if (prev === 0) {
          setPomodoroMinutes(m => {
            if (m === 0) {
              // Timer completed
              if (intervalRef.current) clearInterval(intervalRef.current);
              setIsRunning(false);

              if (!isBreak) {
                setSessionsCompleted(s => s + 1);
                addXP(25);
                const settings = getSettings();
                addStudySession({
                  id: generateId(),
                  date: selectedDate,
                  hours: settings.pomodoroWork / 60,
                  topic: 'Pomodoro Session',
                  category: 'Focus',
                });
                toast.success('Focus session complete! +25 XP');
                setIsBreak(true);
                setPomodoroMinutes(settings.pomodoroBreak);
              } else {
                toast('Break over — time to focus!', { icon: '🎯' });
                setIsBreak(false);
                const settings = getSettings();
                setPomodoroMinutes(settings.pomodoroWork);
              }
              return 0;
            }
            return m - 1;
          });
          return 59;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak, selectedDate]);

  if (!mounted) return null;

  const handleAddTask = () => {
    if (!newTask.title.trim()) { toast.error('Enter a task title'); return; }
    const task: Task = {
      id: generateId(),
      title: newTask.title,
      completed: false,
      priority: newTask.priority,
      timeEstimate: newTask.timeEstimate,
      category: newTask.category,
      date: selectedDate,
    };
    addTask(task);
    setTasksState(getTasks(selectedDate));
    setShowModal(false);
    setNewTask({ title: '', priority: 'medium', timeEstimate: 30, category: 'Study' });
    toast.success('Task added!');
  };

  const handleToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toggleTask(id);
    if (task && !task.completed) addXP(10);
    setTasksState(getTasks(selectedDate));
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    setTasksState(getTasks(selectedDate));
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    savePlannerNotes(selectedDate, val);
  };

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalMinutes = tasks.reduce((s, t) => s + t.timeEstimate, 0);
  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <AppLayout>
      <PageHeader
        title="Daily Planner"
        subtitle="Plan your day with focus and intention"
        icon={<CalendarDays size={20} className="text-white" />}
        action={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Task
          </button>
        }
      />

      {/* Date Navigator */}
      <div className="flex items-center" style={{ gap: '16px', marginBottom: '28px' }}>
        <button onClick={() => navigateDate(-1)} className="p-2 rounded-lg transition-colors" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          {isToday && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,140,255,0.1)', color: 'var(--accent-blue)' }}>
              Today
            </span>
          )}
        </div>
        <button onClick={() => navigateDate(1)} className="p-2 rounded-lg transition-colors" style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '28px' }}>
        {/* ---- Left: Tasks ---- */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary bar */}
          <div className="flex" style={{ gap: '16px', marginBottom: '8px' }}>
            <div className="card flex items-center flex-1" style={{ padding: '14px 20px', gap: '10px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-teal)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {completedCount}/{tasks.length} tasks done
              </span>
            </div>
            <div className="card flex items-center flex-1" style={{ padding: '14px 20px', gap: '10px' }}>
              <Clock size={16} style={{ color: 'var(--accent-amber)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {totalMinutes} min estimated
              </span>
            </div>
          </div>

          {/* Task List */}
          {tasks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <CalendarDays size={40} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-3" />
              <p style={{ color: 'var(--text-secondary)' }}>No tasks for this day</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Click &ldquo;Add Task&rdquo; to start planning</p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <AnimatePresence>
                {tasks.map((task, idx) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="card flex items-center group"
                    style={{ padding: '16px 20px', gap: '14px' }}
                  >
                    <button onClick={() => handleToggle(task.id)} className="shrink-0">
                      {task.completed ? (
                        <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
                      ) : (
                        <Circle size={20} style={{ color: 'var(--text-tertiary)' }} />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{
                          color: task.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                          textDecoration: task.completed ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                          {task.category}
                        </span>
                        <span className="text-[10px] flex items-center gap-0.5" style={{ color: 'var(--text-tertiary)' }}>
                          <Clock size={9} /> {task.timeEstimate}m
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1"
                      style={{ background: `${PRIORITY_CONFIG[task.priority].color}15`, color: PRIORITY_CONFIG[task.priority].color }}
                    >
                      <Flag size={8} />
                      {PRIORITY_CONFIG[task.priority].label}
                    </span>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all shrink-0"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ---- Right: Pomodoro + Notes ---- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pomodoro Timer */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card text-center" style={{ padding: '28px' }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {isBreak ? 'Break Time' : 'Focus Session'}
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>
              Sessions today: {sessionsCompleted}
            </p>

            {/* Timer Display */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              {(() => {
                const circumference = 2 * Math.PI * 72;
                const settings = getSettings();
                const totalSeconds = (isBreak ? settings.pomodoroBreak : settings.pomodoroWork) * 60;
                const elapsed = totalSeconds - (pomodoroMinutes * 60 + pomodoroSeconds);
                const offset = totalSeconds > 0 ? circumference * (1 - (totalSeconds - elapsed) / totalSeconds) : 0;
                return (
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="72" fill="none" stroke="var(--bg-elevated)" strokeWidth="6" />
                    <motion.circle
                      cx="80" cy="80" r="72" fill="none"
                      stroke={isBreak ? 'var(--accent-teal)' : 'var(--accent-blue)'}
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: offset }}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                );
              })()}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                  {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: isRunning ? 'rgba(242,122,142,0.15)' : 'rgba(99,140,255,0.15)',
                  color: isRunning ? 'var(--accent-rose)' : 'var(--accent-blue)',
                }}
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button
                onClick={resetTimer}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </motion.div>

          {/* Notes Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '24px' }}>
            <div className="flex items-center gap-2 mb-3">
              <StickyNote size={16} style={{ color: 'var(--accent-amber)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Daily Notes
              </h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="What's on your mind today..."
              className="w-full h-32 resize-none text-sm"
              style={{ background: 'var(--bg-tertiary)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Task">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Task Title</label>
            <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g., Solve 5 DP problems" className="w-full" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Priority</label>
              <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })} className="w-full">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Time (min)</label>
              <input type="number" value={newTask.timeEstimate} onChange={(e) => setNewTask({ ...newTask, timeEstimate: parseInt(e.target.value) || 0 })} className="w-full" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Category</label>
              <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="w-full">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleAddTask} className="btn-primary w-full mt-2">Add Task</button>
        </div>
      </Modal>
    </AppLayout>
  );
}
