/**
 * store.ts — Lightweight localStorage persistence layer
 * All data is stored as JSON in localStorage with typed accessors.
 * Each domain (goals, tasks, dsa, etc.) has its own key prefix.
 */

// ============================================================
// Type Definitions
// ============================================================

export interface Goal {
  id: string;
  title: string;
  category: 'aiml' | 'dsa' | 'communication' | 'grammar' | 'fitness' | 'custom';
  progress: number; // 0-100
  milestones: Milestone[];
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: number; // minutes
  category: string;
  date: string;
  notes?: string;
}

export interface DSAProblem {
  id: string;
  name: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solved: boolean;
  date: string;
  link?: string;
  notes?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  progress: number;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  githubLink?: string;
  startDate: string;
  notes: string;
}

export interface StudySession {
  id: string;
  date: string;
  hours: number;
  topic: string;
  category: string;
}

export interface DailyLog {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  hoursStudied: number;
  focusTopic: string;
  streakDay: number;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  totalHoursStudied: number;
  achievements: Achievement[];
  joinDate: string;
  theme: 'dark' | 'light';
  focusMode: boolean;
  weeklyGoalHours: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  unlocked: boolean;
}

export interface CommunicationLog {
  id: string;
  date: string;
  type: 'speaking' | 'explanation' | 'grammar' | 'writing';
  duration: number; // minutes
  rating: number; // 1-5
  notes: string;
}

export interface Settings {
  theme: 'dark';
  focusMode: boolean;
  pomodoroWork: number;
  pomodoroBreak: number;
  dailyGoalHours: number;
  notifications: boolean;
  weeklyReview: boolean;
}

// ============================================================
// Storage Keys
// ============================================================

const KEYS = {
  PROFILE: 'aiml_profile',
  GOALS: 'aiml_goals',
  TASKS: 'aiml_tasks',
  DSA: 'aiml_dsa_problems',
  PROJECTS: 'aiml_projects',
  STUDY_SESSIONS: 'aiml_study_sessions',
  DAILY_LOGS: 'aiml_daily_logs',
  COMM_LOGS: 'aiml_comm_logs',
  SETTINGS: 'aiml_settings',
  NOTES: 'aiml_planner_notes',
} as const;

// ============================================================
// Helper — Safe localStorage access (SSR safe)
// ============================================================

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// ============================================================
// Generate unique IDs
// ============================================================

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ============================================================
// Default Data — Pre-seeded for a great first experience
// ============================================================

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'First Steps', description: 'Complete your first task', icon: '🚀', unlocked: false },
  { id: '2', title: 'Week Warrior', description: '7-day study streak', icon: '🔥', unlocked: false },
  { id: '3', title: 'Problem Solver', description: 'Solve 50 DSA problems', icon: '🧩', unlocked: false },
  { id: '4', title: 'Deep Diver', description: 'Study for 4+ hours in one session', icon: '🌊', unlocked: false },
  { id: '5', title: 'Consistency King', description: '30-day study streak', icon: '👑', unlocked: false },
  { id: '6', title: 'ML Pioneer', description: 'Complete ML foundations phase', icon: '🤖', unlocked: false },
  { id: '7', title: 'Code Master', description: 'Solve 100 DSA problems', icon: '⚡', unlocked: false },
  { id: '8', title: 'Project Builder', description: 'Complete 3 projects', icon: '🏗️', unlocked: false },
  { id: '9', title: 'Communicator', description: '15-day speaking streak', icon: '🎤', unlocked: false },
  { id: '10', title: 'Century Club', description: 'Log 100 hours of study', icon: '💯', unlocked: false },
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'Learner',
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  totalHoursStudied: 0,
  achievements: DEFAULT_ACHIEVEMENTS,
  joinDate: new Date().toISOString(),
  theme: 'dark',
  focusMode: false,
  weeklyGoalHours: 20,
};

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  focusMode: false,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  dailyGoalHours: 4,
  notifications: true,
  weeklyReview: true,
};

// ============================================================
// CRUD Operations
// ============================================================

// --- Profile ---
export const getProfile = (): UserProfile => getItem(KEYS.PROFILE, DEFAULT_PROFILE);
export const saveProfile = (profile: UserProfile) => setItem(KEYS.PROFILE, profile);

export function addXP(amount: number): UserProfile {
  const profile = getProfile();
  profile.xp += amount;
  // Level up every 500 XP
  profile.level = Math.floor(profile.xp / 500) + 1;
  saveProfile(profile);
  return profile;
}

// --- Goals ---
export const getGoals = (): Goal[] => getItem(KEYS.GOALS, []);
export const saveGoals = (goals: Goal[]) => setItem(KEYS.GOALS, goals);
export function addGoal(goal: Goal) {
  const goals = getGoals();
  goals.push(goal);
  saveGoals(goals);
}
export function updateGoal(id: string, updates: Partial<Goal>) {
  const goals = getGoals().map(g => g.id === id ? { ...g, ...updates } : g);
  saveGoals(goals);
}
export function deleteGoal(id: string) {
  saveGoals(getGoals().filter(g => g.id !== id));
}

// --- Tasks ---
export const getTasks = (date?: string): Task[] => {
  const all = getItem<Task[]>(KEYS.TASKS, []);
  if (date) return all.filter(t => t.date === date);
  return all;
};
export const saveTasks = (tasks: Task[]) => setItem(KEYS.TASKS, tasks);
export function addTask(task: Task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}
export function toggleTask(id: string) {
  const tasks = getTasks().map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks(tasks);
}
export function deleteTask(id: string) {
  saveTasks(getTasks().filter(t => t.id !== id));
}

// --- DSA Problems ---
export const getDSAProblems = (): DSAProblem[] => getItem(KEYS.DSA, []);
export const saveDSAProblems = (problems: DSAProblem[]) => setItem(KEYS.DSA, problems);
export function addDSAProblem(problem: DSAProblem) {
  const problems = getDSAProblems();
  problems.push(problem);
  saveDSAProblems(problems);
}
export function toggleDSAProblem(id: string) {
  const problems = getDSAProblems().map(p =>
    p.id === id ? { ...p, solved: !p.solved } : p
  );
  saveDSAProblems(problems);
}

// --- Projects ---
export const getProjects = (): Project[] => getItem(KEYS.PROJECTS, []);
export const saveProjects = (projects: Project[]) => setItem(KEYS.PROJECTS, projects);
export function addProject(project: Project) {
  const projects = getProjects();
  projects.push(project);
  saveProjects(projects);
}
export function updateProject(id: string, updates: Partial<Project>) {
  const projects = getProjects().map(p => p.id === id ? { ...p, ...updates } : p);
  saveProjects(projects);
}

// --- Study Sessions ---
export const getStudySessions = (): StudySession[] => getItem(KEYS.STUDY_SESSIONS, []);
export const saveStudySessions = (sessions: StudySession[]) => setItem(KEYS.STUDY_SESSIONS, sessions);
export function addStudySession(session: StudySession) {
  const sessions = getStudySessions();
  sessions.push(session);
  saveStudySessions(sessions);
}

// --- Daily Logs ---
export const getDailyLogs = (): DailyLog[] => getItem(KEYS.DAILY_LOGS, []);
export const saveDailyLogs = (logs: DailyLog[]) => setItem(KEYS.DAILY_LOGS, logs);

// --- Communication Logs ---
export const getCommLogs = (): CommunicationLog[] => getItem(KEYS.COMM_LOGS, []);
export const saveCommLogs = (logs: CommunicationLog[]) => setItem(KEYS.COMM_LOGS, logs);
export function addCommLog(log: CommunicationLog) {
  const logs = getCommLogs();
  logs.push(log);
  saveCommLogs(logs);
}

// --- Settings ---
export const getSettings = (): Settings => getItem(KEYS.SETTINGS, DEFAULT_SETTINGS);
export const saveSettings = (settings: Settings) => setItem(KEYS.SETTINGS, settings);

// --- Planner Notes ---
export const getPlannerNotes = (date: string): string => getItem(`${KEYS.NOTES}_${date}`, '');
export const savePlannerNotes = (date: string, notes: string) => setItem(`${KEYS.NOTES}_${date}`, notes);

// ============================================================
// Analytics Helpers
// ============================================================

export function getWeeklyStudyHours(): number[] {
  const sessions = getStudySessions();
  const now = new Date();
  const result: number[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayHours = sessions
      .filter(s => s.date === dateStr)
      .reduce((sum, s) => sum + s.hours, 0);
    result.push(Number(dayHours.toFixed(1)));
  }

  return result;
}

export function getStreakInfo(): { current: number; longest: number } {
  const logs = getDailyLogs().sort((a, b) => b.date.localeCompare(a.date));
  if (logs.length === 0) return { current: 0, longest: 0 };

  let current = 0;
  let longest = 0;
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];

  for (let i = 0; i < logs.length; i++) {
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split('T')[0];

    if (logs.find(l => l.date === expected && l.tasksCompleted > 0)) {
      streak++;
      if (i === 0 || (i > 0 && streak > 0)) {
        current = streak;
      }
    } else {
      if (i === 0 && today !== expected) continue;
      break;
    }
    longest = Math.max(longest, streak);
  }

  return { current, longest };
}

// ============================================================
// Motivational Quotes
// ============================================================

export const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein" },
  { text: "The future belongs to those who learn more skills and combine them in creative ways.", author: "Robert Greene" },
  { text: "Machine learning is the last invention that humanity will ever need to make.", author: "Nick Bostrom" },
  { text: "In God we trust. All others must bring data.", author: "W. Edwards Deming" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "AI is probably the most important thing humanity has ever worked on.", author: "Sundar Pichai" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Every day is a chance to get 1% better.", author: "James Clear" },
];

export function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
