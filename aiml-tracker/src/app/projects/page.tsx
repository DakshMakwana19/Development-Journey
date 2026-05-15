'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  Plus,
  Trash2,
  GitFork,
  ExternalLink,
  Calendar,
  Edit3,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import {
  Project,
  getProjects,
  addProject,
  updateProject,
  saveProjects,
  generateId,
} from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * Projects Page — Track personal and learning projects with tech stacks,
 * progress, GitHub links, timeline view, and notes.
 */

const STATUS_CONFIG = {
  planning: { color: 'var(--accent-blue)', label: 'Planning' },
  'in-progress': { color: 'var(--accent-amber)', label: 'In Progress' },
  completed: { color: 'var(--accent-green)', label: 'Completed' },
  paused: { color: 'var(--text-tertiary)', label: 'Paused' },
};

const TECH_OPTIONS = ['Python', 'PyTorch', 'TensorFlow', 'React', 'Next.js', 'TypeScript', 'C++', 'Node.js', 'FastAPI', 'Docker', 'AWS', 'HuggingFace', 'Scikit-learn', 'OpenCV', 'LangChain'];

export default function ProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjectsState] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    status: 'planning' as Project['status'],
    githubLink: '',
    notes: '',
    progress: 0,
  });

  useEffect(() => {
    setMounted(true);
    setProjectsState(getProjects());
  }, []);

  if (!mounted) return null;

  const resetForm = () => {
    setForm({ title: '', description: '', techStack: [], status: 'planning', githubLink: '', notes: '', progress: 0 });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!form.title.trim()) { toast.error('Enter project title'); return; }

    if (editingId) {
      updateProject(editingId, {
        title: form.title,
        description: form.description,
        techStack: form.techStack,
        status: form.status,
        githubLink: form.githubLink,
        notes: form.notes,
        progress: form.progress,
      });
      toast.success('Project updated');
    } else {
      addProject({
        id: generateId(),
        title: form.title,
        description: form.description,
        techStack: form.techStack,
        progress: form.progress,
        status: form.status,
        githubLink: form.githubLink,
        startDate: new Date().toISOString().split('T')[0],
        notes: form.notes,
      });
      toast.success('Project added!');
    }
    setProjectsState(getProjects());
    setShowModal(false);
    resetForm();
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      status: project.status,
      githubLink: project.githubLink || '',
      notes: project.notes,
      progress: project.progress,
    });
    setEditingId(project.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
    setProjectsState(getProjects());
    toast.success('Project removed');
  };

  const toggleTech = (tech: string) => {
    setForm(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in-progress').length,
  };

  return (
    <AppLayout>
      <PageHeader
        title="Projects"
        subtitle="Track your builds, experiments, and portfolio pieces"
        icon={<FolderKanban size={20} className="text-white" />}
        action={
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: viewMode === 'grid' ? 'var(--bg-hover)' : 'transparent', color: 'var(--text-secondary)' }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className="px-3 py-1.5 text-xs font-medium transition-colors"
                style={{ background: viewMode === 'timeline' ? 'var(--bg-hover)' : 'transparent', color: 'var(--text-secondary)' }}
              >
                Timeline
              </button>
            </div>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> New Project
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: stats.total, color: 'var(--accent-blue)' },
          { label: 'In Progress', value: stats.inProgress, color: 'var(--accent-amber)' },
          { label: 'Completed', value: stats.completed, color: 'var(--accent-green)' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="card p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <FolderKanban size={48} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-4" />
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No projects yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Start building and track your progress</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {projects.map((project, idx) => {
              const statusCfg = STATUS_CONFIG[project.status];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card p-6 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusCfg.color}15`, color: statusCfg.color }}>
                        {statusCfg.label}
                      </span>
                      <h3 className="text-base font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(project)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-tertiary)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
                    {project.description || 'No description'}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Progress</span>
                      <span className="text-xs font-medium" style={{ color: statusCfg.color }}>{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 0.8 }} style={{ background: statusCfg.color }} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-secondary)' }}>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      <Calendar size={11} />
                      {project.startDate}
                    </div>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <GitFork size={13} /> GitHub <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Timeline View */
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-px" style={{ background: 'var(--border-primary)' }} />
          {projects.sort((a, b) => b.startDate.localeCompare(a.startDate)).map((project, idx) => {
            const statusCfg = STATUS_CONFIG[project.status];
            return (
              <motion.div key={project.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }} className="relative mb-6">
                <div className="absolute -left-5 top-5 w-3 h-3 rounded-full" style={{ background: statusCfg.color, border: '2px solid var(--bg-primary)' }} />
                <div className="card p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${statusCfg.color}15`, color: statusCfg.color }}>{statusCfg.label}</span>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{project.startDate}</span>
                  </div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{project.title}</h4>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techStack.map(t => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>{t}</span>
                    ))}
                  </div>
                  <div className="mt-3 w-full h-1.5 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: statusCfg.color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Project Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingId ? 'Edit Project' : 'New Project'} maxWidth="560px">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Project Title</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Image Classifier" className="w-full" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does this project do?" className="w-full h-20 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Project['status'] })} className="w-full">
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Progress (%)</label>
              <input type="number" min={0} max={100} value={form.progress} onChange={e => setForm({ ...form, progress: parseInt(e.target.value) || 0 })} className="w-full" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Tech Stack</label>
            <div className="flex flex-wrap gap-1.5">
              {TECH_OPTIONS.map(t => (
                <button key={t} onClick={() => toggleTech(t)} className="text-[11px] px-2.5 py-1 rounded-md transition-all" style={{ background: form.techStack.includes(t) ? 'var(--accent-blue)' : 'var(--bg-tertiary)', color: form.techStack.includes(t) ? 'white' : 'var(--text-secondary)' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>GitHub Link (optional)</label>
            <input type="url" value={form.githubLink} onChange={e => setForm({ ...form, githubLink: e.target.value })} placeholder="https://github.com/..." className="w-full" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Notes & Learnings</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Key learnings, challenges, ideas..." className="w-full h-20 resize-none" />
          </div>
          <button onClick={handleSave} className="btn-primary w-full mt-2">
            {editingId ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </Modal>
    </AppLayout>
  );
}
