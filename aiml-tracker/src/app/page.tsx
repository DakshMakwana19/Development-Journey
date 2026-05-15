'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Target,
  BarChart3,
  Code2,
  Zap,
  CheckCircle2,
} from 'lucide-react';

/**
 * Landing Page — The hero entry point of the application.
 * Features: animated hero, motivation quote, roadmap preview, feature showcase.
 */

const FEATURES = [
  {
    icon: <Brain size={22} />,
    title: 'AI/ML Roadmap',
    description: 'Structured learning path from foundations to advanced topics',
    color: 'var(--accent-blue)',
  },
  {
    icon: <Code2 size={22} />,
    title: 'DSA Tracker',
    description: 'Track problems, difficulty analytics, and coding streaks',
    color: 'var(--accent-purple)',
  },
  {
    icon: <Target size={22} />,
    title: 'Goal System',
    description: 'Set milestones, deadlines, and visualize your progress',
    color: 'var(--accent-teal)',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Analytics',
    description: 'Study trends, productivity scores, and consistency graphs',
    color: 'var(--accent-amber)',
  },
  {
    icon: <Zap size={22} />,
    title: 'XP & Levels',
    description: 'Gamified progression with achievements and streaks',
    color: 'var(--accent-green)',
  },
  {
    icon: <CheckCircle2 size={22} />,
    title: 'Daily Planner',
    description: 'Pomodoro timer, deep work sessions, and task management',
    color: 'var(--accent-rose)',
  },
];

const ROADMAP_PREVIEW = [
  { phase: '01', title: 'Foundations', desc: 'Math, Python, Data Science basics' },
  { phase: '02', title: 'Machine Learning', desc: 'Supervised & unsupervised algorithms' },
  { phase: '03', title: 'Deep Learning', desc: 'Neural networks, CNNs, RNNs' },
  { phase: '04', title: 'NLP & Transformers', desc: 'BERT, GPT, prompt engineering' },
  { phase: '05', title: 'MLOps', desc: 'Deployment, monitoring, CI/CD' },
  { phase: '06', title: 'Specialization', desc: 'Research, portfolio, interviews' },
];

// Staggered animation variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen relative" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient Background */}
      <div className="ambient-glow" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' }}
          >
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            AI/ML Journey
          </span>
        </div>
        <Link href="/dashboard">
          <button className="btn-secondary text-sm">Go to Dashboard</button>
        </Link>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-20 pb-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium"
          style={{
            background: 'rgba(99, 140, 255, 0.1)',
            color: 'var(--accent-blue)',
            border: '1px solid rgba(99, 140, 255, 0.2)',
          }}
        >
          <Sparkles size={12} />
          Your AI/ML Engineering Journey Starts Here
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Track. Learn.
          <br />
          <span className="gradient-text">Build the Future.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg max-w-2xl mx-auto mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          A premium productivity platform designed for ambitious engineers.
          Master AI/ML, sharpen your DSA skills, and build a portfolio
          that stands out — all in one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <button className="btn-primary flex items-center gap-2 px-8 py-3 text-base">
              Start Your Journey
              <ArrowRight size={18} />
            </button>
          </Link>
          <Link href="/roadmap">
            <button className="btn-secondary px-8 py-3 text-base">
              View Roadmap
            </button>
          </Link>
        </motion.div>

        {/* Motivation Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 p-6 rounded-2xl max-w-2xl mx-auto"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-primary)',
          }}
        >
          <p className="text-base italic" style={{ color: 'var(--text-secondary)' }}>
            &ldquo;Every day is a chance to get 1% better. Small improvements compound into
            extraordinary results.&rdquo;
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
            — James Clear, Atomic Habits
          </p>
        </motion.div>
      </section>

      {/* ============ FEATURES GRID ============ */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Everything You Need
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            A complete toolkit to accelerate your engineering career
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="card p-6 group cursor-default"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${feature.color}15`, color: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ ROADMAP PREVIEW ============ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Your Learning Roadmap
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Six phases from beginner to AI/ML engineer
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {ROADMAP_PREVIEW.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              variants={itemVariants}
              className="card p-5 flex items-center gap-6 group"
            >
              {/* Phase number */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition-transform group-hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                  color: 'white',
                }}
              >
                {phase.phase}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {phase.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {phase.desc}
                </p>
              </div>
              {/* Progress placeholder */}
              <div
                className="w-20 h-2 rounded-full hidden sm:block"
                style={{ background: 'var(--bg-elevated)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(5, 100 - idx * 18)}%`,
                    background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
                    opacity: 0.6,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link href="/dashboard">
            <button className="btn-primary px-10 py-3.5 text-base flex items-center gap-2 mx-auto">
              Start Your Journey
              <ArrowRight size={18} />
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-8 text-center"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Built with passion for ambitious learners · AI/ML Journey Tracker
        </p>
      </footer>
    </div>
  );
}
