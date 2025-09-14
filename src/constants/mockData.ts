import { Plant, BloomingItem, PruningItem, WisdomQuote, UserProfile } from '../types';

export const mockPlants: Plant[] = [
  {
    id: "1",
    name: "Morning Meditation",
    description: "5 minutes of mindfulness to start the day",
    plantedDate: "2025-01-01",
    category: "habit",
    status: "growing",
    waterCount: 8,
    lastWatered: "2025-01-09",
  },
  {
    id: "2",
    name: "Read 20 Pages Daily",
    description: "Expand knowledge through consistent reading",
    plantedDate: "2025-01-05",
    category: "habit",
    status: "sprout",
    waterCount: 3,
    lastWatered: "2025-01-08",
  },
  {
    id: "3",
    name: "Learn Spanish",
    description: "Practice 15 minutes on language app",
    plantedDate: "2024-12-28",
    category: "goal",
    status: "blooming",
    waterCount: 12,
    lastWatered: "2025-01-09",
  },
];

export const mockBloomingItems: BloomingItem[] = [
  {
    id: "b1",
    plantId: "3",
    name: "Learn Spanish",
    progress: 75,
    streak: 12,
    nextAction: "Complete today's lesson",
  },
  {
    id: "b2",
    plantId: "1",
    name: "Morning Meditation",
    progress: 60,
    streak: 8,
    nextAction: "Tomorrow morning at 7 AM",
  },
];

export const mockPruningItems: PruningItem[] = [
  {
    id: "p1",
    name: "Late Night Social Media",
    reason: "Disrupting sleep schedule",
    prunedDate: "2025-01-07",
    lesson: "Setting boundaries creates space for growth",
  },
  {
    id: "p2",
    name: "Perfectionism in Projects",
    reason: "Preventing completion",
    prunedDate: "2025-01-05",
    lesson: "Progress over perfection nurtures real growth",
  },
];

export const wisdomQuotes: WisdomQuote[] = [
  {
    id: '1',
    text: 'Every small step forward is progress worth celebrating.',
  },
  {
    id: '2',
    text: 'Growth happens in the quiet moments between big wins.',
  },
  {
    id: '3',
    text: 'Your journey is unique — compare only to who you were yesterday.',
  },
  {
    id: '4',
    text: 'Consistency beats perfection every single time.',
  },
  {
    id: '5',
    text: 'Small wins compound into extraordinary transformations.',
  },
  {
    id: '6',
    text: 'Progress is not always visible, but it\'s always happening.',
  },
  {
    id: '7',
    text: 'Celebrate the courage it takes to keep showing up.',
  },
  {
    id: '8',
    text: 'Every bloom started as a seed that refused to give up.',
  },
  {
    id: '9',
    text: 'Your potential grows with every intentional choice.',
  },
  {
    id: '10',
    text: 'Today\'s small effort is tomorrow\'s breakthrough.',
  },
];

export const mockUsers: UserProfile[] = [
  {
    id: 'user-2',
    name: 'Sarah Chen',
    username: 'sarah_blooms',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-15T00:00:00.000Z',
    following: [],
    followers: ['user-1'],
  },
  {
    id: 'user-3',
    name: 'Alex Rivera',
    username: 'alex_grows',
    joinDate: '2024-02-20T00:00:00.000Z',
    following: ['user-1'],
    followers: [],
  },
  {
    id: 'user-4',
    name: 'Maya Patel',
    username: 'maya_mindful',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-03-10T00:00:00.000Z',
    following: [],
    followers: [],
  },
];
