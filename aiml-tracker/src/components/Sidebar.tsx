'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, CalendarDays, Route, Code2,
  FolderKanban, MessageSquare, BarChart3, Settings,
  ChevronLeft, ChevronRight, Sparkles, Menu, X,
  Dumbbell, Gamepad2, Trophy, Flame, Coins,
} from 'lucide-react';
import { getPlayerStats, getXPInCurrentLevel, getXPForNextLevel } from '@/lib/game-store';
import XPBar from '@/components/XPBar';

/**
 * Sidebar — Gamified navigation with XP/Level display.
 * Desktop: collapsible fixed sidebar. Mobile: slide-out drawer.
 */

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/planner', label: 'Planner', icon: CalendarDays },
  { href: '/roadmap', label: 'AI/ML Hub', icon: Route },
  { href: '/dsa', label: 'DSA Hub', icon: Code2 },
  { href: '/gym', label: 'Gym & Fitness', icon: Dumbbell },
  { href: '/communication', label: 'Communication', icon: MessageSquare },
  { href: '/games', label: 'Mini Games', icon: Gamepad2 },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onWidthChange }: { onWidthChange?: (w: number) => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [player, setPlayer] = useState({ xp: 0, level: 1, coins: 0, streak: 0, title: 'Novice Learner' });

  useEffect(() => {
    const p = getPlayerStats();
    setPlayer({ xp: p.xp, level: p.level, coins: p.coins, streak: p.streak, title: p.title });
  }, [pathname]); // refresh on nav

  useEffect(() => {
    onWidthChange?.(collapsed ? 72 : 264);
  }, [collapsed, onWidthChange]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const sidebarWidth = collapsed ? 72 : 264;
  const xpInLevel = getXPInCurrentLevel(player.xp);
  const xpForNext = getXPForNextLevel();

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center shrink-0" style={{ padding: '0 20px', height: '72px', gap: '12px', borderBottom: '1px solid var(--border-primary)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', boxShadow: '0 0 20px rgba(99,140,255,0.3)' }}>
          <Sparkles size={20} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden whitespace-nowrap">
              <h1 className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '-0.02em' }}>LevelUp</h1>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>Gamified Learning</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Player Stats Bar (expanded only) */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '16px 16px 12px 16px', borderBottom: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
              <div className="flex items-center" style={{ gap: '8px' }}>
                <Flame size={14} style={{ color: player.streak > 0 ? 'var(--accent-amber)' : 'var(--text-tertiary)' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: player.streak > 0 ? 'var(--accent-amber)' : 'var(--text-tertiary)' }}>
                  {player.streak} day streak
                </span>
              </div>
              <div className="flex items-center" style={{ gap: '4px' }}>
                <Coins size={12} style={{ color: 'var(--accent-amber)' }} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                  {player.coins.toLocaleString()}
                </span>
              </div>
            </div>
            <XPBar xp={player.xp} xpInLevel={xpInLevel} xpForNext={xpForNext} level={player.level} compact />
            <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '6px', textAlign: 'center' }}>
              {player.title}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '12px 10px' }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href}
                  className="flex items-center rounded-lg transition-all duration-200 relative group"
                  style={{
                    padding: collapsed ? '10px' : '9px 14px',
                    gap: '12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? 'var(--bg-hover)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}>
                  {isActive && (
                    <motion.div layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                      style={{ width: '3px', height: '55%', background: 'var(--accent-blue)' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <Icon size={19} className="shrink-0" style={{ color: isActive ? 'var(--accent-blue)' : undefined }} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }} className="font-medium overflow-hidden whitespace-nowrap"
                        style={{ fontSize: '0.84rem' }}>
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1 rounded-md font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap"
                      style={{ fontSize: '0.75rem', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)' }}>
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center shrink-0 transition-colors hover:opacity-80"
        style={{ height: '48px', borderTop: '1px solid var(--border-primary)', color: 'var(--text-tertiary)' }}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center border-b"
        style={{ height: '56px', padding: '0 16px', background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg" style={{ color: 'var(--text-secondary)' }}>
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-bold" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>LevelUp</span>
        </div>
        <div className="ml-auto flex items-center" style={{ gap: '12px' }}>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <Flame size={14} style={{ color: 'var(--accent-amber)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-amber)' }}>{player.streak}</span>
          </div>
          <div className="flex items-center" style={{ gap: '4px' }}>
            <Coins size={14} style={{ color: 'var(--accent-amber)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-amber)' }}>{player.coins}</span>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed left-0 top-0 h-screen z-50 flex flex-col border-r"
              style={{ width: '264px', background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg"
                style={{ color: 'var(--text-tertiary)' }}>
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside initial={false} animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex fixed left-0 top-0 h-screen z-30 flex-col border-r"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        {sidebarContent}
      </motion.aside>
    </>
  );
}
