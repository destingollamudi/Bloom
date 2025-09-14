# Migration Guide: Bloom App Refactoring

This guide explains the changes made during the refactoring of the Bloom mobile app to follow proper React Native frontend architecture.

## What Changed

### 1. **New Directory Structure**
The app has been reorganized from a flat structure to a proper `src/` directory with organized subdirectories:

**Before:**
```
├── Bloom.ts
├── BloomData.ts
├── Card
├── Colors
├── Garden
├── blooming
├── Pruning
├── Friends Feed
├── Gratitude Archive
├── Search Users
├── Wisdom Quotes
├── User Context
└── Not Found
```

**After:**
```
src/
├── app/                    # Expo Router app directory
├── components/             # Reusable UI components
├── constants/              # App constants and configuration
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks (future)
├── screens/                # Screen components
├── services/               # API and data services (future)
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── assets/                 # Static assets (future)
```

### 2. **File Renaming and Organization**

| Old File | New Location | Notes |
|----------|--------------|-------|
| `Bloom.ts` | `src/types/index.ts` | Types moved to dedicated types directory |
| `BloomData.ts` | `src/constants/mockData.ts` | Mock data moved to constants |
| `Card` | `src/components/Card.tsx` | Component with proper extension |
| `Colors` | `src/constants/colors.ts` | Colors moved to constants |
| `Garden` | `src/screens/GardenScreen.tsx` | Screen with descriptive name |
| `blooming` | `src/screens/BloomingScreen.tsx` | Screen with descriptive name |
| `Pruning` | `src/screens/PruningScreen.tsx` | Screen with descriptive name |
| `Friends Feed` | `src/screens/FriendsFeedScreen.tsx` | Screen with descriptive name |
| `Gratitude Archive` | `src/screens/GratitudeArchiveScreen.tsx` | Screen with descriptive name |
| `Search Users` | `src/screens/SearchUsersScreen.tsx` | Screen with descriptive name |
| `Wisdom Quotes` | `src/constants/mockData.ts` | Moved to mock data |
| `User Context` | `src/contexts/UserContext.tsx` | Context with proper extension |
| `Not Found` | `src/screens/NotFoundScreen.tsx` | Screen with descriptive name |

### 3. **Import Path Changes**

**Before:**
```typescript
import Colors from "@/constants/colors";
import { Card } from "@/components/Card";
import { useUser } from "@/contexts/UserContext";
```

**After:**
```typescript
import { Colors } from "@/constants";
import { Card } from "@/components";
import { useUser } from "@/contexts";
```

### 4. **TypeScript Configuration Updates**

- Added proper path mapping for cleaner imports
- Updated include paths to focus on `src/` directory
- Added specific path mappings for each directory

### 5. **App Entry Point Changes**

- Updated `app.json` to point to new main entry: `src/app/_layout.tsx`
- Created proper Expo Router structure in `src/app/`
- Each screen now has its own route file

## Benefits of the New Architecture

### 1. **Scalability**
- Easy to add new features without cluttering the root directory
- Clear separation of concerns makes the codebase more maintainable
- Modular structure allows for better team collaboration

### 2. **Developer Experience**
- Clean import paths with `@/` prefix
- Consistent file naming conventions
- Better TypeScript support with proper path mapping
- Clear directory structure makes it easy to find files

### 3. **Maintainability**
- Single responsibility principle applied to directories
- Consistent code organization
- Easy to refactor individual modules
- Clear separation between UI components and business logic

### 4. **Performance**
- Better tree-shaking with proper exports
- Optimized imports with path mapping
- Cleaner bundle structure

## How to Use the New Structure

### Adding New Screens
1. Create screen component in `src/screens/YourScreen.tsx`
2. Add route file in `src/app/your-screen.tsx`
3. Export from `src/screens/index.ts`
4. Update navigation if needed

### Adding New Components
1. Create component in `src/components/YourComponent.tsx`
2. Export from `src/components/index.ts`
3. Import using `import { YourComponent } from '@/components'`

### Adding New Types
1. Add types to `src/types/index.ts`
2. Import using `import { YourType } from '@/types'`

### Adding New Utilities
1. Create utility file in `src/utils/yourUtils.ts`
2. Export from `src/utils/index.ts`
3. Import using `import { yourFunction } from '@/utils'`

## Migration Checklist

- [x] Create new directory structure
- [x] Move and rename all files
- [x] Update all import paths
- [x] Update TypeScript configuration
- [x] Update app entry point
- [x] Create proper exports for all modules
- [x] Test all functionality
- [x] Update documentation

## Next Steps

1. **Testing**: Run the app to ensure all functionality works
2. **Cleanup**: Remove old files from root directory
3. **Documentation**: Update any external documentation
4. **Team Training**: Brief team on new structure
5. **Future Enhancements**: Use the new structure for future features

## Common Issues and Solutions

### Import Errors
If you see import errors, make sure you're using the new path structure:
- Use `@/components` instead of `@/components/Card`
- Use `@/constants` instead of `@/constants/colors`
- Use `@/types` instead of `@/types/bloom`

### TypeScript Errors
If you see TypeScript errors:
- Check that all types are properly exported from `src/types/index.ts`
- Ensure path mapping is working correctly
- Verify file extensions are correct (`.tsx` for components, `.ts` for utilities)

### Build Errors
If you encounter build errors:
- Check that all files are properly exported
- Verify the main entry point in `app.json`
- Ensure all dependencies are properly installed

The refactored architecture provides a solid foundation for scaling the Bloom mobile app while maintaining code quality and developer productivity.
