'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Route,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  BookOpen,
  ExternalLink,
  ClipboardList,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import ProgressRing from '@/components/ProgressRing';
import {
  ROADMAP_PHASES,
  getRoadmapProgress,
  toggleTopicCompletion,
  getPhaseCompletion,
  getOverallRoadmapCompletion,
} from '@/lib/roadmap-data';
import { addXP } from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * AI/ML Roadmap Page — Phased learning journey with expandable topic cards.
 * Tracks completion across 6 learning phases with resources and assignments.
 */

export default function RoadmapPage() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [expandedPhase, setExpandedPhase] = useState<string | null>('phase-1');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setProgress(getRoadmapProgress());
  }, []);

  if (!mounted) return null;

  const handleToggleTopic = (topicId: string) => {
    const wasCompleted = progress[topicId];
    const updated = toggleTopicCompletion(topicId);
    setProgress({ ...updated });
    if (!wasCompleted) {
      addXP(30);
      toast.success('Topic completed! +30 XP 🎉');
    }
  };

  const overallCompletion = getOverallRoadmapCompletion(progress);

  return (
    <AppLayout>
      <PageHeader
        title="AI/ML Roadmap"
        subtitle="Your structured path to becoming an AI/ML engineer"
        icon={<Route size={20} className="text-white" />}
      />

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col sm:flex-row items-center"
        style={{ padding: '28px', marginBottom: '36px', gap: '28px' }}
      >
        <ProgressRing
          progress={overallCompletion}
          size={110}
          color="var(--accent-blue)"
          label="Overall"
        />
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Overall Progress
          </h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {Object.values(progress).filter(Boolean).length} of{' '}
            {ROADMAP_PHASES.reduce((s, p) => s + p.topics.length, 0)} topics completed
          </p>
          {/* Phase progress bars */}
          <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: '12px' }}>
            {ROADMAP_PHASES.map(phase => {
              const pct = getPhaseCompletion(phase, progress);
              return (
                <div key={phase.id} className="text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ color: 'var(--text-tertiary)' }}>{phase.icon} {phase.title.split(' ')[0]}</span>
                    <span style={{ color: phase.color }}>{pct}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: phase.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {ROADMAP_PHASES.map((phase, phaseIdx) => {
          const isExpanded = expandedPhase === phase.id;
          const phaseCompletion = getPhaseCompletion(phase, progress);

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.08 }}
              className="card overflow-hidden"
            >
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className="w-full flex items-center text-left transition-colors"
                style={{ padding: '20px 24px', gap: '16px', borderBottom: isExpanded ? '1px solid var(--border-primary)' : 'none' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${phase.color}15` }}
                >
                  {phase.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {phase.title}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                    {phase.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-medium" style={{ color: phase.color }}>
                    {phaseCompletion}%
                  </span>
                  {isExpanded ? (
                    <ChevronDown size={18} style={{ color: 'var(--text-tertiary)' }} />
                  ) : (
                    <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
                  )}
                </div>
              </button>

              {/* Topics (Expandable) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {phase.topics.map((topic) => {
                        const isCompleted = progress[topic.id];
                        const isTopicExpanded = expandedTopic === topic.id;

                        return (
                          <div key={topic.id} className="rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                            <div className="flex items-center" style={{ gap: '14px', padding: '14px 16px' }}>
                              {/* Complete toggle */}
                              <button onClick={() => handleToggleTopic(topic.id)} className="shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                                ) : (
                                  <Circle size={18} style={{ color: 'var(--text-tertiary)' }} />
                                )}
                              </button>
                              {/* Title */}
                              <span
                                className="flex-1 text-sm font-medium"
                                style={{
                                  color: isCompleted ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                  textDecoration: isCompleted ? 'line-through' : 'none',
                                }}
                              >
                                {topic.title}
                              </span>
                              {/* Expand resources */}
                              <button
                                onClick={() => setExpandedTopic(isTopicExpanded ? null : topic.id)}
                                className="text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                              >
                                <BookOpen size={12} />
                                Details
                              </button>
                            </div>

                            {/* Resources + Assignments */}
                            <AnimatePresence>
                              {isTopicExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div style={{ padding: '8px 20px 16px 20px' }} className="border-t" >
                                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '20px', marginTop: '12px' }}>
                                      {/* Resources */}
                                      <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                          <ExternalLink size={12} style={{ color: 'var(--accent-blue)' }} />
                                          <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Resources</span>
                                        </div>
                                        <ul className="space-y-1">
                                          {topic.resources.map((r, i) => (
                                            <li key={i} className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                              • {r}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      {/* Assignments */}
                                      <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                          <ClipboardList size={12} style={{ color: 'var(--accent-purple)' }} />
                                          <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>Assignments</span>
                                        </div>
                                        <ul className="space-y-1">
                                          {topic.assignments.map((a, i) => (
                                            <li key={i} className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                              ✦ {a}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
}
