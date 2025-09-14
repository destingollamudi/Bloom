import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Search, Edit3, Trash2, X } from 'lucide-react-native';
import { Card } from '../components';
import { Colors } from '../constants';
import { useUser, type DailyEntry } from '../contexts';
import { formatDate, formatFullDate, truncateText, getMoodEmoji } from '../utils';

type FilterPeriod = 'all' | 'thisMonth' | 'lastMonth';

const getFilteredEntries = (entries: DailyEntry[], filter: FilterPeriod, searchQuery: string) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let filtered = entries.filter(entry => entry.gratitude && entry.gratitude.trim());
  
  // Apply date filter
  if (filter === 'thisMonth') {
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    });
  } else if (filter === 'lastMonth') {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === lastMonth && entryDate.getFullYear() === lastMonthYear;
    });
  }
  
  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(entry => 
      entry.gratitude?.toLowerCase().includes(query)
    );
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export default function GratitudeArchiveScreen() {
  const { dailyEntries, saveDailyEntries } = useUser();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>('');

  const filteredEntries = useMemo(() => 
    getFilteredEntries(dailyEntries, filterPeriod, searchQuery),
    [dailyEntries, filterPeriod, searchQuery]
  );

  const handleEntryPress = (entry: DailyEntry) => {
    if (!entry || !entry.date) return;
    setSelectedEntry(entry);
    setEditText(entry.gratitude || '');
    setIsDetailModalVisible(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEntry || !editText.trim()) return;
    
    const updatedEntries = dailyEntries.map(entry => 
      entry.date === selectedEntry.date 
        ? { ...entry, gratitude: editText.trim() }
        : entry
    );
    
    await saveDailyEntries(updatedEntries);
    setSelectedEntry({ ...selectedEntry, gratitude: editText.trim() });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!selectedEntry) return;
    
    if (Platform.OS === 'web') {
      const confirmed = confirm('Are you sure you want to delete this gratitude reflection? This action cannot be undone.');
      if (confirmed) {
        deleteReflection();
      }
    } else {
      // For native platforms, we'd use Alert.alert here
      // But since we're focusing on web compatibility, using confirm
      const confirmed = confirm('Are you sure you want to delete this gratitude reflection? This action cannot be undone.');
      if (confirmed) {
        deleteReflection();
      }
    }
  };

  const deleteReflection = async () => {
    if (!selectedEntry) return;
    const updatedEntries = dailyEntries.map(entry => 
      entry.date === selectedEntry.date 
        ? { ...entry, gratitude: undefined }
        : entry
    );
    await saveDailyEntries(updatedEntries);
    setIsDetailModalVisible(false);
  };

  const closeModal = () => {
    setIsDetailModalVisible(false);
    setSelectedEntry(null);
    setIsEditing(false);
    setEditText('');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Gratitude Archive',
          headerStyle: { backgroundColor: Colors.cardBackground },
          headerTintColor: Colors.garden.primary,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              testID="back-button"
            >
              <ArrowLeft size={24} color={Colors.garden.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Gratitude Journey 🌼</Text>
          <Text style={styles.subtitle}>
            Reflecting on the beautiful moments you&apos;ve captured
          </Text>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.periodFilters}>
            {(['all', 'thisMonth', 'lastMonth'] as FilterPeriod[]).map((period) => {
              const labels = { all: 'All', thisMonth: 'This Month', lastMonth: 'Last Month' };
              const isActive = filterPeriod === period;
              return (
                <TouchableOpacity
                  key={period}
                  style={[styles.filterButton, isActive && styles.filterButtonActive]}
                  onPress={() => {
                    if (!period || typeof period !== 'string') return;
                    setFilterPeriod(period);
                  }}
                  testID={`filter-${period}`}
                >
                  <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                    {labels[period]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <View style={styles.searchContainer}>
            <Search size={16} color={Colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reflections..."
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="search-input"
            />
          </View>
        </View>

        {/* Results */}
        {filteredEntries.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🌱</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery.trim() || filterPeriod !== 'all' 
                  ? 'No reflections found' 
                  : 'No reflections yet'
                }
              </Text>
              <Text style={styles.emptyText}>
                {searchQuery.trim() || filterPeriod !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'Your garden starts with one small note.'
                }
              </Text>
            </View>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <TouchableOpacity 
              key={entry.date} 
              onPress={() => {
                if (!entry || !entry.date) return;
                handleEntryPress(entry);
              }}
            >
              <Card>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>{formatDate(entry.date)}</Text>
                  {entry.mood && (
                    <View style={styles.moodBadge}>
                      <Text style={styles.moodEmoji}>{getMoodEmoji(entry.mood)}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.gratitudePreview}>
                  {truncateText(entry.gratitude || '')}
                </Text>
              </Card>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Gratitude Reflection</Text>
            <View style={styles.modalActions}>
              {!isEditing ? (
                <>
                  <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                    <Edit3 size={20} color={Colors.garden.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Trash2 size={20} color={Colors.pruning.primary} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity onPress={handleSaveEdit} style={styles.saveEditButton}>
                  <Text style={styles.saveEditText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {selectedEntry && (
              <>
                <View style={styles.modalEntryHeader}>
                  <Text style={styles.modalDate}>{formatFullDate(selectedEntry.date)}</Text>
                  {selectedEntry.mood && (
                    <View style={styles.modalMoodBadge}>
                      <Text style={styles.modalMoodEmoji}>{getMoodEmoji(selectedEntry.mood)}</Text>
                    </View>
                  )}
                </View>
                
                {isEditing ? (
                  <TextInput
                    style={styles.editInput}
                    value={editText}
                    onChangeText={setEditText}
                    multiline
                    textAlignVertical="top"
                    placeholder="Write your gratitude reflection..."
                    placeholderTextColor={Colors.text.secondary}
                  />
                ) : (
                  <Text style={styles.modalGratitudeText}>{selectedEntry.gratitude}</Text>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  periodFilters: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.text.light,
  },
  filterButtonActive: {
    backgroundColor: Colors.garden.primary,
    borderColor: Colors.garden.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  },
  filterTextActive: {
    color: Colors.cardBackground,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.text.light,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.garden.primary,
  },
  moodBadge: {
    backgroundColor: Colors.garden.pale,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 16,
  },
  gratitudePreview: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.text.light,
    backgroundColor: Colors.cardBackground,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  saveEditButton: {
    backgroundColor: Colors.garden.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveEditText: {
    color: Colors.cardBackground,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalDate: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.garden.primary,
  },
  modalMoodBadge: {
    backgroundColor: Colors.garden.pale,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalMoodEmoji: {
    fontSize: 18,
  },
  modalGratitudeText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  editInput: {
    borderWidth: 1,
    borderColor: Colors.text.light,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  bottomSpacing: {
    height: 20,
  },
});
