'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, Play, Pause, RotateCcw, Timer, Flame, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import { awardXP } from '@/lib/game-store';
import { useReward } from '@/components/RewardPopup';

/**
 * Gym & Fitness Hub — Push/Pull/Legs workout system with timer.
 */

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  muscle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tip: string;
}

interface WorkoutDay {
  id: string;
  title: string;
  emoji: string;
  color: string;
  description: string;
  exercises: Exercise[];
}

const WORKOUTS: WorkoutDay[] = [
  {
    id: 'push', title: 'Push Day', emoji: '💪', color: 'var(--accent-blue)',
    description: 'Chest, shoulders, and triceps',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: '8-10', muscle: 'Chest', difficulty: 'intermediate', tip: 'Keep shoulder blades pinched together' },
      { name: 'Overhead Press', sets: 3, reps: '8-12', muscle: 'Shoulders', difficulty: 'intermediate', tip: 'Brace your core throughout' },
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', muscle: 'Upper Chest', difficulty: 'intermediate', tip: 'Set bench to 30-45 degrees' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', muscle: 'Side Delts', difficulty: 'beginner', tip: 'Lead with your elbows, not wrists' },
      { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', muscle: 'Triceps', difficulty: 'beginner', tip: 'Keep elbows locked at your sides' },
      { name: 'Push-ups', sets: 3, reps: 'To failure', muscle: 'Chest', difficulty: 'beginner', tip: 'Full range of motion' },
    ],
  },
  {
    id: 'pull', title: 'Pull Day', emoji: '🏋️', color: 'var(--accent-teal)',
    description: 'Back and biceps',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5-8', muscle: 'Back', difficulty: 'advanced', tip: 'Hip hinge, keep bar close to body' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', muscle: 'Lats', difficulty: 'intermediate', tip: 'Focus on pulling elbows down' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', muscle: 'Back', difficulty: 'intermediate', tip: 'Keep back flat, squeeze at top' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', muscle: 'Rear Delts', difficulty: 'beginner', tip: 'Pull to forehead height' },
      { name: 'Barbell Curls', sets: 3, reps: '10-12', muscle: 'Biceps', difficulty: 'beginner', tip: 'No swinging, controlled movement' },
      { name: 'Hammer Curls', sets: 3, reps: '12-15', muscle: 'Brachialis', difficulty: 'beginner', tip: 'Neutral grip throughout' },
    ],
  },
  {
    id: 'legs', title: 'Leg Day', emoji: '🦵', color: 'var(--accent-rose)',
    description: 'Quads, hamstrings, and glutes',
    exercises: [
      { name: 'Squats', sets: 4, reps: '6-10', muscle: 'Quads', difficulty: 'intermediate', tip: 'Break at hips first, knees track toes' },
      { name: 'Romanian Deadlift', sets: 3, reps: '8-12', muscle: 'Hamstrings', difficulty: 'intermediate', tip: 'Slight knee bend, push hips back' },
      { name: 'Leg Press', sets: 3, reps: '10-12', muscle: 'Quads', difficulty: 'beginner', tip: 'Don\'t lock knees at the top' },
      { name: 'Walking Lunges', sets: 3, reps: '12 each', muscle: 'Glutes', difficulty: 'beginner', tip: 'Long strides, upright torso' },
      { name: 'Leg Curls', sets: 3, reps: '12-15', muscle: 'Hamstrings', difficulty: 'beginner', tip: 'Slow eccentric phase' },
      { name: 'Calf Raises', sets: 4, reps: '15-20', muscle: 'Calves', difficulty: 'beginner', tip: 'Full stretch at the bottom' },
    ],
  },
  {
    id: 'abs', title: 'Abs & Cardio', emoji: '🔥', color: 'var(--accent-amber)',
    description: 'Core strength and conditioning',
    exercises: [
      { name: 'Plank', sets: 3, reps: '45-60s', muscle: 'Core', difficulty: 'beginner', tip: 'Keep body in a straight line' },
      { name: 'Hanging Leg Raises', sets: 3, reps: '12-15', muscle: 'Lower Abs', difficulty: 'intermediate', tip: 'Control the movement, no swinging' },
      { name: 'Cable Crunches', sets: 3, reps: '15-20', muscle: 'Upper Abs', difficulty: 'beginner', tip: 'Curl your spine, don\'t pull with arms' },
      { name: 'Russian Twists', sets: 3, reps: '20 total', muscle: 'Obliques', difficulty: 'beginner', tip: 'Rotate from your torso, not arms' },
      { name: 'Mountain Climbers', sets: 3, reps: '30s', muscle: 'Core/Cardio', difficulty: 'beginner', tip: 'Keep hips level, drive knees fast' },
      { name: 'Jump Rope', sets: 3, reps: '2 min', muscle: 'Cardio', difficulty: 'beginner', tip: 'Stay on the balls of your feet' },
    ],
  },
];

const DIFF_COLORS = {
  beginner: { bg: 'rgba(126,231,135,0.1)', color: 'var(--accent-green)' },
  intermediate: { bg: 'rgba(240,180,90,0.1)', color: 'var(--accent-amber)' },
  advanced: { bg: 'rgba(242,122,142,0.1)', color: 'var(--accent-rose)' },
};

export default function GymPage() {
  const [mounted, setMounted] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [restTimer, setRestTimer] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reward = useReward();

  useEffect(() => { setMounted(true); }, []);

  // Rest timer
  useEffect(() => {
    if (restRunning && restTimer > 0) {
      restRef.current = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) { setRestRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (restRef.current) clearInterval(restRef.current); };
  }, [restRunning, restTimer]);

  if (!mounted) return null;

  const workout = WORKOUTS.find(w => w.id === activeWorkout);
  const completedCount = workout ? workout.exercises.filter(e => completedExercises.has(`${activeWorkout}-${e.name}`)).length : 0;

  const toggleExercise = (name: string) => {
    const key = `${activeWorkout}-${name}`;
    const next = new Set(completedExercises);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
      const result = awardXP(15, 3);
      reward.showXP(result.xpGained, result.coinsGained);
    }
    setCompletedExercises(next);
  };

  const startRest = (seconds: number) => {
    setRestTimer(seconds);
    setRestRunning(true);
  };

  return (
    <AppLayout>
      <PageHeader
        title="Gym & Fitness"
        subtitle="Push Pull Legs — Build strength systematically"
        icon={<Dumbbell size={22} className="text-white" />}
      />

      {/* Rest Timer (floating) */}
      <AnimatePresence>
        {restTimer > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-40 rounded-2xl flex items-center"
            style={{ padding: '16px 24px', gap: '14px', background: 'rgba(22,27,34,0.95)', border: '1px solid var(--border-primary)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <Timer size={20} style={{ color: 'var(--accent-teal)' }} />
            <span className="font-mono font-bold" style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>
              {Math.floor(restTimer / 60)}:{String(restTimer % 60).padStart(2, '0')}
            </span>
            <button onClick={() => { setRestTimer(0); setRestRunning(false); }}
              className="p-1.5 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>
              <RotateCcw size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeWorkout ? (
        /* Workout Selection */
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '20px' }}>
          {WORKOUTS.map((w, i) => (
            <motion.div key={w.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveWorkout(w.id)}
              className="card cursor-pointer" style={{ padding: '28px' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '14px' }}>{w.emoji}</span>
              <h3 className="font-bold" style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{w.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>{w.description}</p>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{w.exercises.length} exercises</span>
                <span className="font-medium rounded-full" style={{ fontSize: '0.72rem', padding: '4px 12px', background: `${w.color}15`, color: w.color }}>Start →</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : workout && (
        /* Active Workout */
        <div>
          <button onClick={() => { setActiveWorkout(null); setCompletedExercises(new Set()); }}
            className="flex items-center font-medium transition-colors"
            style={{ gap: '6px', fontSize: '0.82rem', color: 'var(--text-tertiary)', marginBottom: '24px' }}>
            ← Back to Workouts
          </button>

          {/* Progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
              <div className="flex items-center" style={{ gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>{workout.emoji}</span>
                <h2 className="font-bold" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{workout.title}</h2>
              </div>
              <span className="font-mono font-bold" style={{ fontSize: '0.85rem', color: workout.color }}>
                {completedCount}/{workout.exercises.length}
              </span>
            </div>
            <div className="rounded-full" style={{ height: '6px', background: 'var(--bg-primary)' }}>
              <motion.div className="h-full rounded-full" animate={{ width: `${(completedCount / workout.exercises.length) * 100}%` }}
                style={{ background: workout.color }} />
            </div>
          </motion.div>

          {/* Rest timer buttons */}
          <div className="flex flex-wrap" style={{ gap: '8px', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '4px' }}>Rest:</span>
            {[30, 60, 90, 120].map(sec => (
              <button key={sec} onClick={() => startRest(sec)} className="rounded-lg font-medium transition-all"
                style={{ padding: '6px 14px', fontSize: '0.78rem', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                {sec}s
              </button>
            ))}
          </div>

          {/* Exercise List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workout.exercises.map((ex, i) => {
              const isCompleted = completedExercises.has(`${activeWorkout}-${ex.name}`);
              const diff = DIFF_COLORS[ex.difficulty];
              return (
                <motion.div key={ex.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card flex items-center" style={{
                    padding: '18px 20px', gap: '14px',
                    borderColor: isCompleted ? 'rgba(126,231,135,0.2)' : undefined,
                    opacity: isCompleted ? 0.7 : 1,
                  }}>
                  <button onClick={() => toggleExercise(ex.name)} className="shrink-0">
                    {isCompleted
                      ? <CheckCircle2 size={22} style={{ color: 'var(--accent-green)' }} />
                      : <div className="rounded-full border-2" style={{ width: '22px', height: '22px', borderColor: 'var(--text-tertiary)' }} />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium" style={{ fontSize: '0.92rem', color: isCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                      {ex.name}
                    </p>
                    <div className="flex items-center flex-wrap" style={{ gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{ex.muscle}</span>
                      <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{ex.sets}×{ex.reps}</span>
                    </div>
                  </div>
                  <span className="rounded-full shrink-0" style={{ fontSize: '0.65rem', padding: '3px 8px', background: diff.bg, color: diff.color, fontWeight: 500 }}>
                    {ex.difficulty}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
