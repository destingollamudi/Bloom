export { default as Colors } from './colors';

// App configuration constants
export const APP_CONFIG = {
  name: 'Bloom Mobile App',
  version: '1.0.0',
  bundleId: 'app.rork.bloom-mobile-app',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  DAILY_ENTRIES: 'bloom_daily_entries',
  USER_STATS: 'bloom_user_stats',
  USER_NAME: 'bloom_user_name',
  BLOOMING_POSTS: 'bloom_blooming_posts',
  PRUNING_POSTS: 'bloom_pruning_posts',
  USER_PROFILE: 'bloom_user_profile',
} as const;

// API endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: 'https://api.bloom.com',
  AUTH: '/auth',
  USERS: '/users',
  POSTS: '/posts',
  REACTIONS: '/reactions',
} as const;

// UI constants
export const UI_CONSTANTS = {
  BORDER_RADIUS: {
    small: 8,
    medium: 12,
    large: 16,
  },
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  FONT_SIZES: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
} as const;
