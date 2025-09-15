import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Card } from "../components";
import { Colors } from "../constants";
import { Plus, User, ExternalLink, Sun, Leaf } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useUser, type Mood, type GardenState, type GardenItem, type Habit, type Goal } from "../contexts";

const moodOptions: { mood: Mood; emoji: string; label: string }[] = [
  { mood: 'great', emoji: '😄', label: 'Great' },
  { mood: 'good', emoji: '🙂', label: 'Good' },
  { mood: 'okay', emoji: '😐', label: 'Okay' },
  { mood: 'struggling', emoji: '😣', label: 'Struggling' },
];

export default function GardenScreen() {
  const insets = useSafeAreaInsets();
  const [gratitudeText, setGratitudeText] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [gardenState, setGardenState] = useState<GardenState>({
    compostPoints: 0,
    gardenItems: [
      { id: '1', type: 'flower', name: 'Sunflower', emoji: '🌻', unlocked: true },
      { id: '2', type: 'flower', name: 'Rose', emoji: '🌹', unlocked: false },
      { id: '3', type: 'tree', name: 'Oak Tree', emoji: '🌳', unlocked: false },
      { id: '4', type: 'decoration', name: 'Garden Gnome', emoji: '🧙‍♂️', unlocked: false },
    ],
    habits: [],
    goals: [],
  });
  
  const {
    userName,
    getGreeting,
    getTodayEntry,
    updateTodayMood,
    updateTodayGratitude,
    bloomingPosts,
    pruningPosts,
  } = useUser();

  const todayEntry = getTodayEntry();

  useEffect(() => {
    if (todayEntry?.gratitude) {
      setGratitudeText(todayEntry.gratitude);
    }
  }, [todayEntry?.gratitude]);

  useEffect(() => {
    const pruningCount = pruningPosts.length;
    const bloomingCount = bloomingPosts.length;
    
    const baseCompost = pruningCount * 2;
    const usedCompost = Math.floor(bloomingCount / 2) * 3;
    const currentCompost = Math.max(0, baseCompost - usedCompost);
    
    setGardenState(prev => ({
      ...prev,
      compostPoints: currentCompost,
      gardenItems: prev.gardenItems.map(item => ({
        ...item,
        unlocked: item.id === '1' || bloomingCount >= parseInt(item.id) * 2
      }))
    }));
  }, [bloomingPosts.length, pruningPosts.length]);

  const addNewHabit = () => {
    Alert.prompt(
      'New Habit',
      'What habit would you like to track?',
      (text) => {
        if (text && text.trim()) {
          const newHabit: Habit = {
            id: Date.now().toString(),
            name: text.trim(),
            description: 'Daily habit tracking',
            createdAt: new Date().toISOString(),
          };
          setGardenState(prev => ({
            ...prev,
            habits: [...prev.habits, newHabit]
          }));
        }
      }
    );
  };

  const addNewGoal = () => {
    Alert.prompt(
      'New Goal',
      'What goal would you like to achieve?',
      (text) => {
        if (text && text.trim()) {
          const newGoal: Goal = {
            id: Date.now().toString(),
            name: text.trim(),
            description: 'Personal goal',
            createdAt: new Date().toISOString(),
          };
          setGardenState(prev => ({
            ...prev,
            goals: [...prev.goals, newGoal]
          }));
        }
      }
    );
  };

  const showPlantSeedOptions = () => {
    Alert.alert(
      'Plant a New Seed',
      'What would you like to add to your garden?',
      [
        { text: 'Add New Habit', onPress: addNewHabit },
        { text: 'Add New Goal', onPress: addNewGoal },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const deleteItem = (type: 'habit' | 'goal', id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setGardenState(prev => ({
              ...prev,
              [type === 'habit' ? 'habits' : 'goals']: prev[type === 'habit' ? 'habits' : 'goals'].filter(item => item.id !== id)
            }));
          }
        },
      ]
    );
  };

  const handleMoodSelect = async (mood: Mood) => {
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await updateTodayMood(mood);
  };

  const handleSaveGratitude = async () => {
    if (!gratitudeText.trim()) {
      Alert.alert('Empty Reflection', 'Please write something you&apos;re grateful for.');
      return;
    }

    await updateTodayGratitude(gratitudeText);
    setSaveMessage('Reflection saved! 🌸');
    
    setTimeout(() => {
      setSaveMessage('');
    }, 2000);

    if (Platform.OS !== "web") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const navigateToMyAccount = () => {
    Alert.alert(
      'My Account',
      'Choose an option:',
      [
        { text: 'Discover Friends', onPress: () => router.push('/search-users') },
        { text: 'Gratitude Archive', onPress: () => router.push('/gratitude-archive') },
        { text: 'Profile Settings', onPress: () => Alert.alert('Profile Settings', 'Profile management coming soon!') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const navigateToGratitudeArchive = () => {
    router.push('/gratitude-archive');
  };

  return (
    <ScrollView 
      style={[styles.container, { 
        paddingTop: insets.top,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom + 80 : 80
      }]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting Banner */}
      <View style={styles.greetingBanner}>
        <View style={styles.greetingContent}>
          <View style={styles.greetingWithSun}>
            <Sun size={20} color={Colors.cardBackground} />
            <Text style={styles.greetingText}>{getGreeting()}, {userName}!</Text>
          </View>
          <Text style={styles.greetingSubtext}>Ready to bloom today?</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={navigateToMyAccount}
          testID="profile-button"
        >
          <User size={20} color={Colors.cardBackground} />
        </TouchableOpacity>
      </View>

      {/* Garden Growth Card */}
      <Card>
        <Text style={styles.cardTitle}>Your Growing Garden 🌱</Text>
        <View style={styles.gardenContainer}>
          <View style={styles.gardenRow}>
            {gardenState.gardenItems.slice(0, 2).map(item => (
              <View key={item.id} style={styles.gardenItem}>
                <Text style={[styles.gardenEmoji, !item.unlocked && styles.lockedItem]}>
                  {item.unlocked ? item.emoji : '🔒'}
                </Text>
                <Text style={styles.gardenItemName}>{item.name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.gardenRow}>
            {gardenState.gardenItems.slice(2, 4).map(item => (
              <View key={item.id} style={styles.gardenItem}>
                <Text style={[styles.gardenEmoji, !item.unlocked && styles.lockedItem]}>
                  {item.unlocked ? item.emoji : '🔒'}
                </Text>
                <Text style={styles.gardenItemName}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.compostContainer}>
          <Leaf size={16} color={Colors.garden.primary} />
          <Text style={styles.compostText}>
            Compost: {gardenState.compostPoints} points
          </Text>
          {gardenState.compostPoints > 0 && (
            <Text style={styles.compostBonus}>Next bloom will be enhanced! 🌸✨</Text>
          )}
        </View>
      </Card>

      {/* Mood Check-in Card */}
      <Card>
        <Text style={styles.cardTitle}>Today&apos;s Check-In 😊</Text>
        <View style={styles.moodContainer}>
          {moodOptions.map(({ mood, emoji, label }) => {
            const isSelected = todayEntry?.mood === mood;
            return (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodButton,
                  isSelected && styles.moodButtonSelected,
                ]}
                onPress={() => handleMoodSelect(mood)}
                testID={`mood-${mood}`}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  isSelected && styles.moodLabelSelected,
                ]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Gratitude Reflection Card */}
      <Card>
        <View style={styles.gratitudeHeader}>
          <Text style={styles.cardTitle}>Gratitude Reflection 🌼</Text>
          <TouchableOpacity 
            onPress={navigateToGratitudeArchive}
            style={styles.archiveLink}
            testID="view-archive-button"
          >
            <Text style={styles.archiveLinkText}>View Archive</Text>
            <ExternalLink size={14} color={Colors.garden.primary} />
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.gratitudeInput}
          placeholder="One thing I&apos;m grateful for today…"
          placeholderTextColor={Colors.text.secondary}
          value={gratitudeText}
          onChangeText={setGratitudeText}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          testID="gratitude-input"
        />
        
        <View style={styles.gratitudeFooter}>
          {saveMessage ? (
            <Text style={styles.saveMessage}>{saveMessage}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveGratitude}
            testID="save-reflection-button"
          >
            <Text style={styles.saveButtonText}>
              {todayEntry?.gratitude ? 'Update Reflection' : 'Save Reflection'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <TouchableOpacity style={styles.addButton} activeOpacity={0.8} onPress={showPlantSeedOptions}>
        <Plus size={20} color={Colors.cardBackground} />
        <Text style={styles.addButtonText}>Plant New Seed</Text>
      </TouchableOpacity>

      {/* Habits Section */}
      {gardenState.habits.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Your Habits ({gardenState.habits.length})</Text>
          {gardenState.habits.map((habit) => (
            <Card key={habit.id}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{habit.name}</Text>
                  <Text style={styles.itemDescription}>{habit.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem('habit', habit.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </>
      )}

      {/* Goals Section */}
      {gardenState.goals.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Your Goals ({gardenState.goals.length})</Text>
          {gardenState.goals.map((goal) => (
            <Card key={goal.id}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{goal.name}</Text>
                  <Text style={styles.itemDescription}>{goal.description}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteItem('goal', goal.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  greetingBanner: {
    backgroundColor: Colors.garden.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingContent: {
    flex: 1,
  },
  greetingWithSun: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.cardBackground,
  },
  greetingSubtext: {
    fontSize: 14,
    color: Colors.cardBackground,
    opacity: 0.9,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gardenContainer: {
    marginBottom: 16,
  },
  gardenRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  gardenItem: {
    alignItems: 'center',
    flex: 1,
  },
  gardenEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  lockedItem: {
    opacity: 0.3,
  },
  gardenItemName: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  compostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.garden.pale,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  compostText: {
    fontSize: 14,
    color: Colors.garden.primary,
    fontWeight: '600' as const,
  },
  compostBonus: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: 'italic' as const,
    marginLeft: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: Colors.garden.pale,
    borderColor: Colors.garden.primary,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  },
  moodLabelSelected: {
    color: Colors.garden.primary,
  },
  gratitudeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  archiveLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  archiveLinkText: {
    fontSize: 14,
    color: Colors.garden.primary,
    fontWeight: '600' as const,
  },
  gratitudeInput: {
    borderWidth: 1,
    borderColor: Colors.text.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: Colors.text.primary,
    minHeight: 80,
    marginBottom: 16,
  },
  gratitudeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveMessage: {
    fontSize: 14,
    color: Colors.garden.primary,
    fontWeight: '600' as const,
  },
  saveButton: {
    backgroundColor: Colors.garden.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.cardBackground,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  addButton: {
    backgroundColor: Colors.garden.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 0,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.text.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: 'bold' as const,
  },
  bottomSpacing: {
    height: 20,
  },
});
