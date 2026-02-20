export type Vibe = 'energized' | 'calm' | 'drained' | 'focused';

export interface Task {
  id: string;
  title: string;
  description: string;
  energyLevel: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  completedInVibe?: Vibe;
  tags: string[];
}

export interface VibeSession {
  vibe: Vibe;
  timestamp: number;
  tasksCompleted: number;
  xpEarned: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  lastCheckIn: number;
  vibeSessions: VibeSession[];
}

export const VIBE_CONFIG = {
  energized: {
    emoji: '🔥',
    label: 'Energized',
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    taskFilter: ['high', 'medium'],
  },
  calm: {
    emoji: '🌊',
    label: 'Calm',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    taskFilter: ['medium', 'low'],
  },
  drained: {
    emoji: '😴',
    label: 'Drained',
    color: '#6b7280',
    gradient: 'from-gray-500 to-slate-500',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30',
    taskFilter: ['low'],
  },
  focused: {
    emoji: '🎯',
    label: 'Focused',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    taskFilter: ['high'],
  },
} as const;
