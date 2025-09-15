import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { 
  DailyEntry, 
  UserStats, 
  BloomingPost, 
  PruningPost, 
  FeedPost, 
  UserProfile, 
  Mood 
} from '../types';
import { STORAGE_KEYS } from '../constants';
import { getTodayDate, getGreeting } from '../utils';

export const [UserProvider, useUser] = createContextHook(() => {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({ blooms: 12, weeds: 8 });
  const [userName, setUserName] = useState<string>('Friend');
  const [bloomingPosts, setBloomingPosts] = useState<BloomingPost[]>([]);
  const [pruningPosts, setPruningPosts] = useState<PruningPost[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null; displayName: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [compostPoints, setCompostPoints] = useState<number>(0);
  const [following, setFollowing] = useState<string[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);

  // Initialize without Firebase for now
  useEffect(() => {
    let isMounted = true;
    
    const initLocalUser = async () => {
      if (isMounted) {
        // Create a mock user for local development
        const mockUser = {
          uid: 'local-user-' + Date.now(),
          email: null,
          displayName: null
        };
        
        setCurrentUser(mockUser);
      }
    };

    initLocalUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load user data when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    
    let isMounted = true;
    
    const loadUserData = async () => {
      try {
        const [entriesData, statsData, nameData, postsData, pruningData, profileData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_ENTRIES),
          AsyncStorage.getItem(STORAGE_KEYS.USER_STATS),
          AsyncStorage.getItem(STORAGE_KEYS.USER_NAME),
          AsyncStorage.getItem(STORAGE_KEYS.BLOOMING_POSTS),
          AsyncStorage.getItem(STORAGE_KEYS.PRUNING_POSTS),
          AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        ]);

        if (!isMounted) return;

        if (entriesData) {
          setDailyEntries(JSON.parse(entriesData));
        }
        if (statsData) {
          setUserStats(JSON.parse(statsData));
        }
        if (nameData) {
          setUserName(nameData);
        }
        if (postsData) {
          setBloomingPosts(JSON.parse(postsData));
        }
        if (pruningData) {
          setPruningPosts(JSON.parse(pruningData));
        }
        if (profileData) {
          const profile = JSON.parse(profileData);
          setUserProfile(profile);
          setFollowing(profile.following || []);
          setFollowers(profile.followers || []);
        } else {
          // Create default profile
          const defaultProfile: UserProfile = {
            id: currentUser.uid,
            name: userName,
            username: `user_${currentUser.uid.slice(0, 8)}`,
            joinDate: new Date().toISOString(),
            following: [],
            followers: [],
          };
          setUserProfile(defaultProfile);
          await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Load feed posts from local storage for now
  useEffect(() => {
    const mockFeedPosts: FeedPost[] = [
      ...bloomingPosts.map(post => ({
        id: post.id,
        userId: post.userId,
        userName: post.userName || 'Anonymous',
        userAvatar: post.userAvatar,
        type: post.type,
        content: post.caption || '',
        photoUrl: post.photoUrl,
        timestamp: post.timestamp,
        reactions: post.reactions,
      })),
      ...pruningPosts.map(post => ({
        id: post.id,
        userId: post.userId,
        userName: post.userName || 'Anonymous',
        userAvatar: post.userAvatar,
        type: post.type,
        content: `${post.habitName}: ${post.whyItMatters}`,
        timestamp: post.timestamp,
        reactions: {
          growth: [],
          applause: [],
          love: [],
        },
      }))
    ].sort((a, b) => b.timestamp - a.timestamp);
    
    setFeedPosts(mockFeedPosts);
  }, [bloomingPosts, pruningPosts]);

  const saveDailyEntries = useCallback(async (entries: DailyEntry[]) => {
    try {
      if (!entries || !Array.isArray(entries)) return;
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_ENTRIES, JSON.stringify(entries));
      setDailyEntries(entries);
    } catch (error) {
      console.error('Error saving daily entries:', error);
    }
  }, []);

  const saveUserStats = useCallback(async (stats: UserStats) => {
    try {
      if (!stats || typeof stats.blooms !== 'number' || typeof stats.weeds !== 'number') return;
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
      setUserStats(stats);
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }, []);

  const getTodayEntry = useCallback((): DailyEntry | undefined => {
    const today = getTodayDate();
    return dailyEntries.find(entry => entry.date === today);
  }, [dailyEntries]);

  const updateTodayMood = useCallback(async (mood: Mood) => {
    const today = getTodayDate();
    const todayEntry = dailyEntries.find(entry => entry.date === today);
    
    if (!mood || !['great', 'good', 'okay', 'struggling'].includes(mood)) return;
    
    const updatedEntries = todayEntry
      ? dailyEntries.map(entry => 
          entry.date === today ? { ...entry, mood } : entry
        )
      : [...dailyEntries, { date: today, mood }];
    
    await saveDailyEntries(updatedEntries);
  }, [dailyEntries, saveDailyEntries]);

  const updateTodayGratitude = useCallback(async (gratitude: string) => {
    const today = getTodayDate();
    const todayEntry = dailyEntries.find(entry => entry.date === today);
    
    if (typeof gratitude !== 'string' || gratitude.length > 500) return;
    
    const sanitizedGratitude = gratitude.trim();
    
    const updatedEntries = todayEntry
      ? dailyEntries.map(entry => 
          entry.date === today ? { ...entry, gratitude: sanitizedGratitude } : entry
        )
      : [...dailyEntries, { date: today, gratitude: sanitizedGratitude }];
    
    await saveDailyEntries(updatedEntries);
  }, [dailyEntries, saveDailyEntries]);

  const incrementBlooms = useCallback(async () => {
    const newStats = { ...userStats, blooms: userStats.blooms + 1 };
    await saveUserStats(newStats);
  }, [userStats, saveUserStats]);

  const incrementWeeds = useCallback(async () => {
    const newStats = { ...userStats, weeds: userStats.weeds + 1 };
    await saveUserStats(newStats);
  }, [userStats, saveUserStats]);

  const saveBloomingPosts = useCallback(async (posts: BloomingPost[]) => {
    try {
      if (!posts || !Array.isArray(posts)) return;
      await AsyncStorage.setItem(STORAGE_KEYS.BLOOMING_POSTS, JSON.stringify(posts));
      setBloomingPosts(posts);
    } catch (error) {
      console.error('Error saving blooming posts:', error);
    }
  }, []);

  const addBloomingPost = useCallback(async (caption: string, photoUrl?: string) => {
    const sanitizedCaption = caption?.trim() || '';
    
    if (!caption || typeof caption !== 'string' || sanitizedCaption.length === 0 || sanitizedCaption.length > 280) {
      return;
    }
    
    const newPost: BloomingPost = {
      id: Date.now().toString(),
      userId: 'user-1',
      type: 'bloom',
      caption: sanitizedCaption,
      date: getTodayDate(),
      timestamp: Date.now(),
      reactions: {
        growth: [],
        applause: [],
        love: [],
      },
      visibility: 'friends' as const,
      userName: userProfile?.name || userName,
      userAvatar: userProfile?.avatar,
      ...(photoUrl && { photoUrl }),
    };
    
    const updatedPosts = [newPost, ...bloomingPosts];
    await saveBloomingPosts(updatedPosts);
    await incrementBlooms();
    
    // Use compost points if available
    if (compostPoints > 0) {
      console.log(`Your compost enriched the soil — your blooms doubled 🌸🌸! Used ${compostPoints} compost points.`);
      setCompostPoints(0); // Reset compost after use
    }
  }, [bloomingPosts, saveBloomingPosts, incrementBlooms, compostPoints, userProfile, userName]);

  const getCurrentStreak = useCallback(() => {
    if (bloomingPosts.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasPostOnDate = bloomingPosts.some(post => post.date === dateStr);
      
      if (hasPostOnDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [bloomingPosts]);

  const getBestStreak = useCallback(() => {
    if (bloomingPosts.length === 0) return 0;
    
    const sortedPosts = [...bloomingPosts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const uniqueDates = [...new Set(sortedPosts.map(post => post.date))];
    
    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;
    
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      
      if (previousDate) {
        const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      maxStreak = Math.max(maxStreak, currentStreak);
      previousDate = currentDate;
    }
    
    return maxStreak;
  }, [bloomingPosts]);

  const savePruningPosts = useCallback(async (posts: PruningPost[]) => {
    try {
      if (!posts || !Array.isArray(posts)) return;
      await AsyncStorage.setItem(STORAGE_KEYS.PRUNING_POSTS, JSON.stringify(posts));
      setPruningPosts(posts);
    } catch (error) {
      console.error('Error saving pruning posts:', error);
    }
  }, []);

  const addPruningPost = useCallback(async (
    habitName: string,
    whyItMatters: string,
    strategy: string,
    severity: 'Low' | 'Medium' | 'High'
  ) => {
    const sanitizedHabitName = habitName?.trim() || '';
    const sanitizedWhyItMatters = whyItMatters?.trim() || '';
    const sanitizedStrategy = strategy?.trim() || '';
    
    if (!habitName || typeof habitName !== 'string' || sanitizedHabitName.length === 0 || sanitizedHabitName.length > 100) {
      return;
    }
    
    if (!whyItMatters || typeof whyItMatters !== 'string' || sanitizedWhyItMatters.length === 0 || sanitizedWhyItMatters.length > 280) {
      return;
    }
    
    if (!severity || !['Low', 'Medium', 'High'].includes(severity)) {
      return;
    }
    
    const newPost: PruningPost = {
      id: Date.now().toString(),
      userId: 'user-1',
      type: 'prune',
      habitName: sanitizedHabitName,
      whyItMatters: sanitizedWhyItMatters,
      strategy: sanitizedStrategy || undefined,
      severity,
      date: getTodayDate(),
      timestamp: Date.now(),
      visibility: 'friends' as const,
      userName: userProfile?.name || userName,
      userAvatar: userProfile?.avatar,
    };
    
    const updatedPosts = [newPost, ...pruningPosts];
    await savePruningPosts(updatedPosts);
    await incrementWeeds();
    
    // Add compost points based on severity
    const compostGain = severity === 'High' ? 3 : severity === 'Medium' ? 2 : 1;
    setCompostPoints(prev => prev + compostGain);
    console.log(`Your pruning nourishes the soil ✂️🌱. Gained ${compostGain} compost points. Stronger blooms ahead.`);
  }, [pruningPosts, savePruningPosts, incrementWeeds, userProfile, userName]);

  const followUser = useCallback(async (userId: string) => {
    if (!currentUser || !userProfile) return;
    
    const updatedFollowing = [...following, userId];
    setFollowing(updatedFollowing);
    
    const updatedProfile = { ...userProfile, following: updatedFollowing };
    setUserProfile(updatedProfile);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
  }, [currentUser, userProfile, following]);

  const unfollowUser = useCallback(async (userId: string) => {
    if (!currentUser || !userProfile) return;
    
    const updatedFollowing = following.filter(id => id !== userId);
    setFollowing(updatedFollowing);
    
    const updatedProfile = { ...userProfile, following: updatedFollowing };
    setUserProfile(updatedProfile);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
  }, [currentUser, userProfile, following]);

  const reactToPost = useCallback(async (postId: string, reactionType: 'growth' | 'applause' | 'love') => {
    if (!currentUser) return;
    
    // For now, just update local state
    console.log(`Reacted to post ${postId} with ${reactionType}`);
  }, [currentUser]);

  return {
    dailyEntries,
    userStats,
    userName,
    bloomingPosts,
    pruningPosts,
    feedPosts,
    userProfile,
    currentUser,
    following,
    followers,
    isLoading,
    compostPoints,
    getTodayEntry,
    updateTodayMood,
    updateTodayGratitude,
    incrementBlooms,
    incrementWeeds,
    getGreeting,
    saveDailyEntries,
    addBloomingPost,
    addPruningPost,
    getCurrentStreak,
    getBestStreak,
    followUser,
    unfollowUser,
    reactToPost,
  };
});
