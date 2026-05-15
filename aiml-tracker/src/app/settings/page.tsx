'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Clock,
  Bell,
  Eye,
  RotateCcw,
  Trophy,
  Sparkles,
  Save,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import PageHeader from '@/components/PageHeader';
import {
  getProfile,
  saveProfile,
  getSettings,
  saveSettings,
  Settings,
  UserProfile,
} from '@/lib/store';
import toast from 'react-hot-toast';

/**
 * Settings & Personalization — Theme, focus mode, Pomodoro config,
 * notification preferences, profile, and achievements display.
 */

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettingsState] = useState<Settings | null>(null);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    setMounted(true);
    const p = getProfile();
    const s = getSettings();
    setProfile(p);
    setSettingsState(s);
    setNameInput(p.name);
  }, []);

  if (!mounted || !profile || !settings) return null;

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettingsState(updated);
    saveSettings(updated);
    toast.success('Setting updated');
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    const updated = { ...profile, name: nameInput.trim() };
    setProfile(updated);
    saveProfile(updated);
    toast.success('Name updated');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset ALL data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const unlockedCount = profile.achievements.filter(a => a.unlocked).length;

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        subtitle="Personalize your experience"
        icon={<SettingsIcon size={20} className="text-white" />}
      />

      <div className="max-w-3xl" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px' }}>
          <div className="flex items-center" style={{ gap: '10px', marginBottom: '24px' }}>
            <User size={18} style={{ color: 'var(--accent-blue)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Profile</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center" style={{ gap: '18px', marginBottom: '24px' }}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
              style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', color: 'white' }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center" style={{ gap: '10px', marginBottom: '14px' }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1"
                  placeholder="Your name"
                />
                <button onClick={handleSaveName} className="btn-primary flex items-center gap-1.5 py-2">
                  <Save size={14} /> Save
                </button>
              </div>
              <div className="flex items-center" style={{ gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Level {profile.level}</span>
                <span>·</span>
                <span>{profile.xp} XP</span>
                <span>·</span>
                <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Level {profile.level} → Level {profile.level + 1}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {profile.xp % 500}/500 XP
              </span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${((profile.xp % 500) / 500) * 100}%`,
                  background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Pomodoro Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ padding: '28px' }}>
          <div className="flex items-center" style={{ gap: '10px', marginBottom: '24px' }}>
            <Clock size={18} style={{ color: 'var(--accent-teal)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Pomodoro Timer</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: '18px' }}>
            <div>
              <label className="font-medium block" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Work Duration (min)
              </label>
              <input
                type="number"
                value={settings.pomodoroWork}
                onChange={(e) => updateSetting('pomodoroWork', parseInt(e.target.value) || 25)}
                className="w-full"
                min={5}
                max={90}
              />
            </div>
            <div>
              <label className="font-medium block" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Break Duration (min)
              </label>
              <input
                type="number"
                value={settings.pomodoroBreak}
                onChange={(e) => updateSetting('pomodoroBreak', parseInt(e.target.value) || 5)}
                className="w-full"
                min={1}
                max={30}
              />
            </div>
            <div>
              <label className="font-medium block" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Daily Goal (hours)
              </label>
              <input
                type="number"
                value={settings.dailyGoalHours}
                onChange={(e) => updateSetting('dailyGoalHours', parseInt(e.target.value) || 4)}
                className="w-full"
                min={1}
                max={16}
              />
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ padding: '28px' }}>
          <div className="flex items-center" style={{ gap: '10px', marginBottom: '24px' }}>
            <Eye size={18} style={{ color: 'var(--accent-purple)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Preferences</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Focus Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>Focus Mode</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>Minimize distractions with a cleaner interface</p>
              </div>
              <button
                onClick={() => updateSetting('focusMode', !settings.focusMode)}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{
                  background: settings.focusMode ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                  border: `1px solid ${settings.focusMode ? 'var(--accent-blue)' : 'var(--border-primary)'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all absolute top-0.5"
                  style={{
                    left: settings.focusMode ? '22px' : '3px',
                    background: settings.focusMode ? 'white' : 'var(--text-tertiary)',
                  }}
                />
              </button>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>Notifications</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>Show toast notifications for actions</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', !settings.notifications)}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{
                  background: settings.notifications ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                  border: `1px solid ${settings.notifications ? 'var(--accent-blue)' : 'var(--border-primary)'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all absolute top-0.5"
                  style={{
                    left: settings.notifications ? '22px' : '3px',
                    background: settings.notifications ? 'white' : 'var(--text-tertiary)',
                  }}
                />
              </button>
            </div>

            {/* Weekly Review */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>Weekly Review Reminder</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '3px' }}>Prompt a weekly progress review</p>
              </div>
              <button
                onClick={() => updateSetting('weeklyReview', !settings.weeklyReview)}
                className="w-11 h-6 rounded-full transition-colors relative"
                style={{
                  background: settings.weeklyReview ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                  border: `1px solid ${settings.weeklyReview ? 'var(--accent-blue)' : 'var(--border-primary)'}`,
                }}
              >
                <div
                  className="w-4 h-4 rounded-full transition-all absolute top-0.5"
                  style={{
                    left: settings.weeklyReview ? '22px' : '3px',
                    background: settings.weeklyReview ? 'white' : 'var(--text-tertiary)',
                  }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ padding: '28px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
            <div className="flex items-center" style={{ gap: '10px' }}>
              <Trophy size={18} style={{ color: 'var(--accent-amber)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Achievements</h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
              {unlockedCount}/{profile.achievements.length} unlocked
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" style={{ gap: '14px' }}>
            {profile.achievements.map(achievement => (
              <div
                key={achievement.id}
                className="text-center rounded-xl transition-all"
                style={{
                  padding: '16px 12px',
                  background: achievement.unlocked ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                  opacity: achievement.unlocked ? 1 : 0.4,
                  border: `1px solid ${achievement.unlocked ? 'var(--border-accent)' : 'var(--border-secondary)'}`,
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{achievement.icon}</span>
                <p className="font-medium" style={{ fontSize: '0.72rem', color: 'var(--text-primary)', marginTop: '8px' }}>
                  {achievement.title}
                </p>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ padding: '28px' }}>
          <div className="flex items-center" style={{ gap: '10px', marginBottom: '18px' }}>
            <RotateCcw size={18} style={{ color: 'var(--accent-rose)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Danger Zone</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
            Reset all data to start fresh. This action cannot be undone.
          </p>
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'rgba(242,122,142,0.1)',
              color: 'var(--accent-rose)',
              border: '1px solid rgba(242,122,142,0.3)',
            }}
          >
            Reset All Data
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
