# Bloom Mobile App - Refactored Architecture

This directory contains the refactored Bloom mobile app following proper React Native frontend architecture patterns for scalability.

## Directory Structure

```
src/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Main tab layout with UserProvider
│   ├── index.tsx          # Root redirect to garden
│   ├── garden.tsx         # Garden screen route
│   ├── blooming.tsx       # Blooming screen route
│   ├── pruning.tsx        # Pruning screen route
│   ├── friends-feed.tsx   # Friends feed screen route
│   ├── gratitude-archive.tsx # Gratitude archive screen route
│   ├── search-users.tsx   # Search users screen route
│   └── +not-found.tsx     # 404 screen route
├── components/             # Reusable UI components
│   ├── Card.tsx           # Card component
│   └── index.ts           # Component exports
├── constants/              # App constants and configuration
│   ├── colors.ts          # Color theme
│   ├── mockData.ts        # Mock data for development
│   └── index.ts           # Constants exports
├── contexts/               # React Context providers
│   ├── UserContext.tsx    # User state management
│   └── index.ts           # Context exports
├── hooks/                  # Custom React hooks (future)
├── screens/                # Screen components
│   ├── GardenScreen.tsx   # Main garden screen
│   ├── BloomingScreen.tsx # Blooming posts screen
│   ├── PruningScreen.tsx  # Pruning posts screen
│   ├── FriendsFeedScreen.tsx # Friends feed screen
│   ├── GratitudeArchiveScreen.tsx # Gratitude archive screen
│   ├── SearchUsersScreen.tsx # User search screen
│   ├── NotFoundScreen.tsx # 404 screen
│   └── index.ts           # Screen exports
├── services/               # API and data services (future)
├── types/                  # TypeScript type definitions
│   └── index.ts           # All type exports
├── utils/                  # Utility functions
│   ├── dateUtils.ts       # Date formatting utilities
│   ├── textUtils.ts       # Text processing utilities
│   └── index.ts           # Utility exports
├── assets/                 # Static assets (future)
├── index.ts               # Main src exports
└── README.md              # This file
```

## Architecture Principles

### 1. **Separation of Concerns**
- **Components**: Pure UI components with minimal logic
- **Screens**: Screen-specific logic and state management
- **Contexts**: Global state management
- **Utils**: Pure functions for data transformation
- **Types**: Centralized type definitions

### 2. **Scalability**
- Modular structure allows easy addition of new features
- Clear separation makes testing easier
- Consistent naming conventions
- Proper TypeScript usage throughout

### 3. **Maintainability**
- Single responsibility principle
- DRY (Don't Repeat Yourself) principle
- Consistent file organization
- Clear import/export patterns

### 4. **Developer Experience**
- Path mapping for clean imports (`@/components`, `@/screens`, etc.)
- TypeScript for type safety
- Consistent code formatting
- Clear documentation

## Key Features

### State Management
- Uses React Context for global state
- Local state for component-specific data
- AsyncStorage for persistence

### Navigation
- Expo Router for file-based routing
- Tab navigation for main screens
- Stack navigation for modal screens

### Type Safety
- Comprehensive TypeScript types
- Proper interface definitions
- Type-safe props and state

### Styling
- StyleSheet for performance
- Consistent color theming
- Responsive design patterns

## Usage

### Importing Components
```typescript
import { Card } from '@/components';
import { Colors } from '@/constants';
import { useUser } from '@/contexts';
```

### Adding New Screens
1. Create screen component in `src/screens/`
2. Add route file in `src/app/`
3. Export from `src/screens/index.ts`
4. Update navigation if needed

### Adding New Components
1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Use consistent naming conventions

### Adding New Types
1. Add types to `src/types/index.ts`
2. Use descriptive interface names
3. Export from main types file

## Future Enhancements

- Add custom hooks in `src/hooks/`
- Implement API services in `src/services/`
- Add more reusable components
- Implement proper error boundaries
- Add unit and integration tests
- Add storybook for component documentation
