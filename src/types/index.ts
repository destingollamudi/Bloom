// Core domain types
export interface Plant {
  id: string;
  name: string;
  description: string;
  plantedDate: string;
  category: "habit" | "goal" | "mindset";
  status: "seed" | "sprout" | "growing" | "blooming";
  waterCount: number;
  lastWatered?: string;
}

export interface BloomingItem {
  id: string;
  plantId: string;
  name: string;
  progress: number;
  streak: number;
  nextAction: string;
}

export interface BloomingPost {
  id: string;
  userId: string;
  type: 'bloom';
  photoUrl?: string;
  caption: string;
  timestamp: number;
  reactions: {
    growth: number; // 🌱
    applause: number; // 👏
    love: number; // 💜
  };
  isShared: boolean;
}

export interface WisdomQuote {
  id: string;
  text: string;
  author?: string;
}

export interface PruningItem {
  id: string;
  name: string;
  reason: string;
  prunedDate: string;
  lesson: string;
}

export interface PruningPost {
  id: string;
  userId: string;
  type: 'prune';
  habitName: string;
  whyItMatters: string;
  strategy?: string;
  severity: 'Low' | 'Medium' | 'High';
  timestamp: number;
  date: string;
  isShared: boolean;
}

// User and context types
export type Mood = 'great' | 'good' | 'okay' | 'struggling';

export interface DailyEntry {
  date: string;
  mood?: Mood;
  gratitude?: string;
}

export interface UserStats {
  blooms: number;
  weeds: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  joinDate: string;
  following: string[];
  followers: string[];
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'bloom' | 'prune' | 'reflection';
  content: string;
  photoUrl?: string;
  timestamp: number;
  reactions: {
    growth: string[];
    applause: string[];
    love: string[];
  };
}

export interface GratitudePost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'reflection';
  content: string;
  mood?: Mood;
  timestamp: number;
  date: string;
  visibility: 'private';
}

// Garden specific types
export interface GardenState {
  compostPoints: number;
  gardenItems: GardenItem[];
  habits: Habit[];
  goals: Goal[];
}

export interface GardenItem {
  id: string;
  type: 'flower' | 'tree' | 'decoration';
  name: string;
  emoji: string;
  unlocked: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// API and service types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Navigation types
export type RootStackParamList = {
  index: undefined;
  garden: undefined;
  blooming: undefined;
  pruning: undefined;
  'friends-feed': undefined;
  'gratitude-archive': undefined;
  'search-users': undefined;
  'not-found': undefined;
};

export type TabParamList = {
  garden: undefined;
  blooming: undefined;
  pruning: undefined;
  'friends-feed': undefined;
};
