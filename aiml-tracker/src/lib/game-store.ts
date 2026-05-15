/**
 * game-store.ts — Core Gamification Engine
 * Handles XP, levels, coins, streaks, achievements, quests, and inventory.
 * All data persisted in localStorage.
 */

// ======================== TYPES ========================

export interface PlayerStats {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalTasksCompleted: number;
  totalStudyHours: number;
  joinDate: string;
  title: string;
  avatarStyle: number;
  unlockedAvatars: number[];
  equippedItems: Record<string, string>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'study' | 'dsa' | 'fitness' | 'streak' | 'social' | 'special';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  coinReward: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  category: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  icon: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'theme' | 'pet' | 'badge' | 'title' | 'effect';
  price: number;
  icon: string;
  owned: boolean;
  equipped: boolean;
}

export interface ActivityLog {
  date: string;
  xpGained: number;
  tasksCompleted: number;
  studyMinutes: number;
  problemsSolved: number;
}

// ======================== CONSTANTS ========================

const XP_PER_LEVEL = 500;
const STREAK_BONUS_MULTIPLIER = 0.1; // 10% per streak day, max 5x

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice Learner',
  5: 'Apprentice Coder',
  10: 'Rising Scholar',
  15: 'Algorithm Knight',
  20: 'Data Sage',
  25: 'Neural Architect',
  30: 'AI Grandmaster',
  40: 'Digital Titan',
  50: 'Legendary Engineer',
};

export function getTitleForLevel(level: number): string {
  let title = 'Novice Learner';
  for (const [lvl, t] of Object.entries(LEVEL_TITLES)) {
    if (level >= parseInt(lvl)) title = t;
  }
  return title;
}

// ======================== ACHIEVEMENTS DATA ========================

export const ACHIEVEMENTS_DATA: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Study achievements
  { id: 'first-study', title: 'First Steps', description: 'Complete your first study session', icon: '📖', category: 'study', requirement: 1, xpReward: 50, coinReward: 10 },
  { id: 'study-10', title: 'Bookworm', description: 'Complete 10 study sessions', icon: '📚', category: 'study', requirement: 10, xpReward: 100, coinReward: 25 },
  { id: 'study-50', title: 'Scholar', description: 'Complete 50 study sessions', icon: '🎓', category: 'study', requirement: 50, xpReward: 300, coinReward: 75 },
  { id: 'study-100', title: 'Professor', description: 'Complete 100 study sessions', icon: '👨‍🏫', category: 'study', requirement: 100, xpReward: 500, coinReward: 150 },
  { id: 'hours-10', title: 'Dedicated', description: 'Study for 10 total hours', icon: '⏰', category: 'study', requirement: 10, xpReward: 200, coinReward: 50 },
  { id: 'hours-50', title: 'Time Lord', description: 'Study for 50 total hours', icon: '⌛', category: 'study', requirement: 50, xpReward: 500, coinReward: 100 },

  // DSA achievements
  { id: 'dsa-1', title: 'Problem Solver', description: 'Solve your first DSA problem', icon: '🧩', category: 'dsa', requirement: 1, xpReward: 50, coinReward: 10 },
  { id: 'dsa-25', title: 'Algorithm Apprentice', description: 'Solve 25 DSA problems', icon: '⚡', category: 'dsa', requirement: 25, xpReward: 200, coinReward: 50 },
  { id: 'dsa-50', title: 'Code Warrior', description: 'Solve 50 DSA problems', icon: '⚔️', category: 'dsa', requirement: 50, xpReward: 400, coinReward: 100 },
  { id: 'dsa-100', title: 'Algorithm Master', description: 'Solve 100 DSA problems', icon: '🏆', category: 'dsa', requirement: 100, xpReward: 800, coinReward: 200 },
  { id: 'dsa-hard-5', title: 'Fearless', description: 'Solve 5 hard problems', icon: '🔥', category: 'dsa', requirement: 5, xpReward: 300, coinReward: 75 },

  // Streak achievements
  { id: 'streak-3', title: 'Getting Started', description: '3-day streak', icon: '🔥', category: 'streak', requirement: 3, xpReward: 75, coinReward: 15 },
  { id: 'streak-7', title: 'Week Warrior', description: '7-day streak', icon: '💪', category: 'streak', requirement: 7, xpReward: 150, coinReward: 30 },
  { id: 'streak-14', title: 'Unstoppable', description: '14-day streak', icon: '🌟', category: 'streak', requirement: 14, xpReward: 300, coinReward: 60 },
  { id: 'streak-30', title: 'Iron Will', description: '30-day streak', icon: '💎', category: 'streak', requirement: 30, xpReward: 600, coinReward: 150 },
  { id: 'streak-100', title: 'Legendary Discipline', description: '100-day streak', icon: '👑', category: 'streak', requirement: 100, xpReward: 2000, coinReward: 500 },

  // Fitness achievements
  { id: 'workout-1', title: 'Gym Newbie', description: 'Complete first workout', icon: '🏋️', category: 'fitness', requirement: 1, xpReward: 50, coinReward: 10 },
  { id: 'workout-10', title: 'Getting Fit', description: 'Complete 10 workouts', icon: '💪', category: 'fitness', requirement: 10, xpReward: 200, coinReward: 50 },
  { id: 'workout-50', title: 'Beast Mode', description: 'Complete 50 workouts', icon: '🦁', category: 'fitness', requirement: 50, xpReward: 500, coinReward: 125 },

  // Special achievements
  { id: 'level-5', title: 'Leveling Up', description: 'Reach Level 5', icon: '⬆️', category: 'special', requirement: 5, xpReward: 100, coinReward: 50 },
  { id: 'level-10', title: 'Double Digits', description: 'Reach Level 10', icon: '🔟', category: 'special', requirement: 10, xpReward: 250, coinReward: 100 },
  { id: 'level-25', title: 'Quarter Century', description: 'Reach Level 25', icon: '🌠', category: 'special', requirement: 25, xpReward: 500, coinReward: 250 },
  { id: 'coins-500', title: 'Coin Collector', description: 'Earn 500 coins total', icon: '🪙', category: 'special', requirement: 500, xpReward: 100, coinReward: 0 },
  { id: 'coins-2000', title: 'Treasure Hunter', description: 'Earn 2000 coins total', icon: '💰', category: 'special', requirement: 2000, xpReward: 300, coinReward: 0 },
  { id: 'all-quests', title: 'Quest Master', description: 'Complete all daily quests in one day', icon: '🗡️', category: 'special', requirement: 1, xpReward: 200, coinReward: 50 },
];

// ======================== QUEST TEMPLATES ========================

const DAILY_QUEST_POOL: Omit<Quest, 'id' | 'progress' | 'completed'>[] = [
  { title: 'Study Session', description: 'Complete a 25-min Pomodoro session', type: 'daily', category: 'study', target: 1, xpReward: 30, coinReward: 5, icon: '📖' },
  { title: 'Problem Crusher', description: 'Solve 2 DSA problems', type: 'daily', category: 'dsa', target: 2, xpReward: 40, coinReward: 8, icon: '🧩' },
  { title: 'Task Master', description: 'Complete 3 planned tasks', type: 'daily', category: 'tasks', target: 3, xpReward: 35, coinReward: 6, icon: '✅' },
  { title: 'Knowledge Seeker', description: 'Complete a roadmap topic', type: 'daily', category: 'roadmap', target: 1, xpReward: 50, coinReward: 10, icon: '🗺️' },
  { title: 'Move Your Body', description: 'Complete a workout', type: 'daily', category: 'fitness', target: 1, xpReward: 35, coinReward: 7, icon: '🏋️' },
  { title: 'Daily Coder', description: 'Write code for 30 minutes', type: 'daily', category: 'study', target: 1, xpReward: 30, coinReward: 5, icon: '💻' },
  { title: 'Quick Learner', description: 'Complete a mini quiz', type: 'daily', category: 'study', target: 1, xpReward: 25, coinReward: 4, icon: '🧠' },
  { title: 'Communicator', description: 'Practice speaking for 10 min', type: 'daily', category: 'communication', target: 1, xpReward: 30, coinReward: 5, icon: '🎤' },
];

const WEEKLY_QUEST_POOL: Omit<Quest, 'id' | 'progress' | 'completed'>[] = [
  { title: 'Weekly Warrior', description: 'Maintain a 7-day streak', type: 'weekly', category: 'streak', target: 7, xpReward: 150, coinReward: 30, icon: '🔥' },
  { title: 'DSA Marathon', description: 'Solve 10 problems this week', type: 'weekly', category: 'dsa', target: 10, xpReward: 200, coinReward: 40, icon: '⚡' },
  { title: 'Study Champion', description: 'Study 10+ hours this week', type: 'weekly', category: 'study', target: 10, xpReward: 250, coinReward: 50, icon: '🏆' },
  { title: 'All-Rounder', description: 'Complete tasks in 3 different categories', type: 'weekly', category: 'special', target: 3, xpReward: 180, coinReward: 35, icon: '🌟' },
];

// ======================== STORAGE HELPERS ========================

const PLAYER_KEY = 'game_player';
const ACHIEVEMENTS_KEY = 'game_achievements';
const QUESTS_KEY = 'game_quests';
const QUESTS_DATE_KEY = 'game_quests_date';
const INVENTORY_KEY = 'game_inventory';
const ACTIVITY_KEY = 'game_activity';
const TOTAL_COINS_KEY = 'game_total_coins';

function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function setJSON(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ======================== PLAYER STATS ========================

export function getPlayerStats(): PlayerStats {
  const today = new Date().toISOString().split('T')[0];
  return getJSON<PlayerStats>(PLAYER_KEY, {
    xp: 0, level: 1, coins: 0, streak: 0, longestStreak: 0,
    lastActiveDate: today, totalTasksCompleted: 0, totalStudyHours: 0,
    joinDate: today, title: 'Novice Learner', avatarStyle: 0,
    unlockedAvatars: [0], equippedItems: {},
  });
}

export function savePlayerStats(stats: PlayerStats): void {
  setJSON(PLAYER_KEY, stats);
}

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXPInCurrentLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function getXPForNextLevel(): number {
  return XP_PER_LEVEL;
}

/** Award XP and coins. Returns { leveledUp, newLevel, xpGained, coinsGained } */
export function awardXP(baseXP: number, coins: number = 0): {
  leveledUp: boolean; newLevel: number; xpGained: number; coinsGained: number;
} {
  const stats = getPlayerStats();
  const today = new Date().toISOString().split('T')[0];

  // Streak bonus
  const streakMultiplier = Math.min(1 + stats.streak * STREAK_BONUS_MULTIPLIER, 5);
  const xpGained = Math.round(baseXP * streakMultiplier);
  const coinsGained = Math.round(coins * streakMultiplier);

  const oldLevel = stats.level;
  stats.xp += xpGained;
  stats.coins += coinsGained;
  stats.level = calculateLevel(stats.xp);
  stats.title = getTitleForLevel(stats.level);
  stats.lastActiveDate = today;

  // Track total coins
  const totalCoins = getJSON<number>(TOTAL_COINS_KEY, 0) + coinsGained;
  setJSON(TOTAL_COINS_KEY, totalCoins);

  savePlayerStats(stats);

  // Log activity
  logActivity(today, xpGained, 0, 0, 0);

  return {
    leveledUp: stats.level > oldLevel,
    newLevel: stats.level,
    xpGained,
    coinsGained,
  };
}

/** Update daily streak. Call once per day on first activity. */
export function updateStreak(): { streakBroken: boolean; currentStreak: number } {
  const stats = getPlayerStats();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (stats.lastActiveDate === today) {
    return { streakBroken: false, currentStreak: stats.streak };
  }

  if (stats.lastActiveDate === yesterday) {
    stats.streak += 1;
  } else if (stats.lastActiveDate !== today) {
    const broken = stats.streak > 0;
    stats.streak = 1;
    stats.lastActiveDate = today;
    savePlayerStats(stats);
    return { streakBroken: broken, currentStreak: 1 };
  }

  stats.longestStreak = Math.max(stats.longestStreak, stats.streak);
  stats.lastActiveDate = today;
  savePlayerStats(stats);
  return { streakBroken: false, currentStreak: stats.streak };
}

// ======================== ACHIEVEMENTS ========================

export function getAchievements(): Achievement[] {
  const stored = getJSON<Record<string, { unlocked: boolean; unlockedAt?: string }>>(ACHIEVEMENTS_KEY, {});
  return ACHIEVEMENTS_DATA.map(a => ({
    ...a,
    unlocked: stored[a.id]?.unlocked || false,
    unlockedAt: stored[a.id]?.unlockedAt,
  }));
}

export function checkAndUnlockAchievements(context: {
  tasksCompleted?: number;
  problemsSolved?: number;
  hardSolved?: number;
  streak?: number;
  level?: number;
  studyHours?: number;
  workouts?: number;
  totalCoins?: number;
  allDailyQuestsDone?: boolean;
}): Achievement[] {
  const stored = getJSON<Record<string, { unlocked: boolean; unlockedAt?: string }>>(ACHIEVEMENTS_KEY, {});
  const newlyUnlocked: Achievement[] = [];

  const checks: Record<string, number | boolean | undefined> = {
    'first-study': context.tasksCompleted,
    'study-10': context.tasksCompleted,
    'study-50': context.tasksCompleted,
    'study-100': context.tasksCompleted,
    'hours-10': context.studyHours,
    'hours-50': context.studyHours,
    'dsa-1': context.problemsSolved,
    'dsa-25': context.problemsSolved,
    'dsa-50': context.problemsSolved,
    'dsa-100': context.problemsSolved,
    'dsa-hard-5': context.hardSolved,
    'streak-3': context.streak,
    'streak-7': context.streak,
    'streak-14': context.streak,
    'streak-30': context.streak,
    'streak-100': context.streak,
    'workout-1': context.workouts,
    'workout-10': context.workouts,
    'workout-50': context.workouts,
    'level-5': context.level,
    'level-10': context.level,
    'level-25': context.level,
    'coins-500': context.totalCoins,
    'coins-2000': context.totalCoins,
    'all-quests': context.allDailyQuestsDone ? 1 : 0,
  };

  for (const achData of ACHIEVEMENTS_DATA) {
    if (stored[achData.id]?.unlocked) continue;
    const val = checks[achData.id];
    if (val !== undefined && typeof val === 'number' && val >= achData.requirement) {
      stored[achData.id] = { unlocked: true, unlockedAt: new Date().toISOString() };
      newlyUnlocked.push({ ...achData, unlocked: true, unlockedAt: stored[achData.id].unlockedAt });
    }
  }

  if (newlyUnlocked.length > 0) {
    setJSON(ACHIEVEMENTS_KEY, stored);
    // Award XP/coins for each achievement
    for (const ach of newlyUnlocked) {
      awardXP(ach.xpReward, ach.coinReward);
    }
  }

  return newlyUnlocked;
}

// ======================== DAILY QUESTS ========================

function generateDailyQuests(): Quest[] {
  const shuffled = [...DAILY_QUEST_POOL].sort(() => Math.random() - 0.5);
  const dailies = shuffled.slice(0, 3).map((q, i) => ({
    ...q, id: `daily-${i}`, progress: 0, completed: false,
  }));
  const weeklyIdx = Math.floor(Math.random() * WEEKLY_QUEST_POOL.length);
  const weekly = { ...WEEKLY_QUEST_POOL[weeklyIdx], id: 'weekly-0', progress: 0, completed: false };
  return [...dailies, weekly];
}

export function getDailyQuests(): Quest[] {
  const today = new Date().toISOString().split('T')[0];
  const storedDate = getJSON<string>(QUESTS_DATE_KEY, '');

  if (storedDate !== today) {
    const quests = generateDailyQuests();
    setJSON(QUESTS_KEY, quests);
    setJSON(QUESTS_DATE_KEY, today);
    return quests;
  }

  return getJSON<Quest[]>(QUESTS_KEY, generateDailyQuests());
}

export function updateQuestProgress(category: string, amount: number = 1): Quest[] {
  const quests = getDailyQuests();
  let changed = false;

  for (const q of quests) {
    if (q.completed) continue;
    if (q.category === category || q.category === 'special') {
      q.progress = Math.min(q.progress + amount, q.target);
      if (q.progress >= q.target) {
        q.completed = true;
        awardXP(q.xpReward, q.coinReward);
      }
      changed = true;
    }
  }

  if (changed) setJSON(QUESTS_KEY, quests);
  return quests;
}

// ======================== ACTIVITY LOG ========================

function logActivity(date: string, xp: number, tasks: number, minutes: number, problems: number): void {
  const log = getJSON<ActivityLog[]>(ACTIVITY_KEY, []);
  const existing = log.find(l => l.date === date);
  if (existing) {
    existing.xpGained += xp;
    existing.tasksCompleted += tasks;
    existing.studyMinutes += minutes;
    existing.problemsSolved += problems;
  } else {
    log.push({ date, xpGained: xp, tasksCompleted: tasks, studyMinutes: minutes, problemsSolved: problems });
  }
  // Keep last 90 days
  const cutoff = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];
  setJSON(ACTIVITY_KEY, log.filter(l => l.date >= cutoff));
}

export function getActivityLog(days: number = 30): ActivityLog[] {
  const log = getJSON<ActivityLog[]>(ACTIVITY_KEY, []);
  const cutoff = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  return log.filter(l => l.date >= cutoff);
}

export function getTotalCoinsEarned(): number {
  return getJSON<number>(TOTAL_COINS_KEY, 0);
}
