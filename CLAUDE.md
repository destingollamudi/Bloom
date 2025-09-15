# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `expo start` - Start the development server
- `expo start --web` - Start web development server
- `expo start --tunnel` - Start with tunnel for remote testing
- `expo lint` - Run ESLint for code linting

### Build Commands
No specific build commands configured. Use Expo CLI for production builds when needed.

## Project Architecture

### Framework & Stack
- **React Native + Expo 54**: Cross-platform mobile app
- **Expo Router 6**: File-based routing with tab navigation
- **TypeScript 5.9**: Type-safe development
- **NativeWind 4**: Tailwind CSS for React Native styling
- **Zustand + AsyncStorage**: Local state persistence
- **Firebase 12**: Authentication and potential cloud services
- **React Query**: Server state management (configured but not yet implemented)

### Directory Structure
```
src/
├── app/           # Expo Router pages (file-based routing)
├── components/    # Reusable UI components
├── constants/     # App configuration, colors, mock data
├── contexts/      # React Context providers (UserContext)
├── screens/       # Screen components
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── hooks/         # Custom React hooks (future)
└── services/      # API services (future)
```

### Path Mapping
Import aliases configured in tsconfig.json:
- `@/*` → `./src/*`
- `@/components/*` → `./src/components/*`
- `@/screens/*` → `./src/screens/*`
- `@/contexts/*` → `./src/contexts/*`
- And more for each directory

### Navigation Structure
Main app uses tab navigation with 4 primary screens:
- **Garden**: Main dashboard/home screen
- **Blooming**: Post positive experiences/achievements
- **Pruning**: Track and eliminate bad habits
- **Friends Feed**: Social feed of friends' activities

Additional screens (modal/stack):
- Search Users, Gratitude Archive, Not Found

### State Management
- **UserContext**: Central state management using React Context
- **Local Storage**: AsyncStorage for data persistence
- **Mock User System**: Currently using local mock authentication
- **Key State**: Daily entries, user stats, blooming/pruning posts, feed posts, user profiles

### Key Features & Domain Concepts
- **Blooming**: Positive experiences/achievements users share
- **Pruning**: Bad habits users want to eliminate
- **Garden Metaphor**: Growth-focused app theme throughout
- **Compost Points**: Gamification system for pruning activities
- **Streak System**: Track daily blooming consistency
- **Social Features**: Following, reactions, feed

### Type System
Comprehensive TypeScript types defined in `src/types/index.ts`:
- DailyEntry, UserStats, BloomingPost, PruningPost
- FeedPost, UserProfile, Mood types
- Proper type safety throughout the app

### Styling Approach
- **NativeWind**: Tailwind CSS classes for React Native
- **Colors System**: Centralized color theme in `src/constants/colors.ts`
- **Theme-based**: Colors organized by feature (garden, blooming, pruning)

## Important Development Notes

### Current State
- App is in active refactoring from flat structure to organized architecture
- Migration from single-file components to proper modular structure
- Firebase configured but using local mock data for development
- No server/backend currently - all data stored locally via AsyncStorage

### Code Patterns
- Use React Context for global state, local state for component-specific data
- All screens follow `*Screen.tsx` naming convention
- Components use proper TypeScript interfaces
- Consistent export patterns from index.ts files
- Path aliases for clean imports (`@/components` not `../components`)

### Firebase Integration
Firebase is configured but currently using mock local data. When implementing:
- Authentication setup ready in UserContext
- Firestore integration prepared but not active
- Switch from AsyncStorage to Firebase when ready

### ESLint Configuration
Using expo/flat ESLint config with ignores for dist directory.