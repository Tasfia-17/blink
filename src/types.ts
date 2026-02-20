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
    label: 'Energized',
    icon: '/assets/energized-icon.svg',
    bgClass: 'bg-gradient-to-br from-red-50 via-orange-50 to-rose-50',
    borderClass: 'border-2 border-red-200',
    activeClass: 'bg-gradient-to-r from-red-500 to-orange-500',
    buttonClass: 'bg-gradient-to-r from-red-500 to-orange-500',
    taskFilter: ['high', 'medium'],
  },
  calm: {
    label: 'Calm',
    icon: '/assets/calm-icon.svg',
    bgClass: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50',
    borderClass: 'border-2 border-blue-200',
    activeClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    buttonClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    taskFilter: ['medium', 'low'],
  },
  drained: {
    label: 'Drained',
    icon: '/assets/drained-icon.svg',
    bgClass: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50',
    borderClass: 'border-2 border-purple-200',
    activeClass: 'bg-gradient-to-r from-purple-500 to-violet-500',
    buttonClass: 'bg-gradient-to-r from-purple-500 to-violet-500',
    taskFilter: ['low'],
  },
  focused: {
    label: 'Focused',
    icon: '/assets/focused-icon.svg',
    bgClass: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
    borderClass: 'border-2 border-amber-200',
    activeClass: 'bg-gradient-to-r from-amber-500 to-pink-500',
    buttonClass: 'bg-gradient-to-r from-amber-500 to-pink-500',
    taskFilter: ['high'],
  },
} as const;
