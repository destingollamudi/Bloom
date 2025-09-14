import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Card } from "../components";
import { Colors } from "../constants";
import { Scissors } from "lucide-react-native";
import { useUser } from "../contexts";

type Severity = 'Low' | 'Medium' | 'High';

export default function PruningScreen() {
  const { pruningPosts, addPruningPost } = useUser();
  const [habitName, setHabitName] = useState<string>('');
  const [whyItMatters, setWhyItMatters] = useState<string>('');
  const [strategy, setStrategy] = useState<string>('');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>('Medium');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!habitName.trim() || !whyItMatters.trim()) {
      Alert.alert('Missing Information', 'Please fill in the habit name and why it matters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPruningPost(habitName, whyItMatters, strategy, selectedSeverity);
      setHabitName('');
      setWhyItMatters('');
      setStrategy('');
      setSelectedSeverity('Medium');
      Alert.alert('Success', 'Your habit has been shared for accountability!');
    } catch (error) {
      console.error('Error adding pruning post:', error);
      Alert.alert('Error', 'Failed to share your habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: Severity) => {
    switch (severity) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'High': return '#F44336';
      default: return Colors.pruning.primary;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prune What Holds You Back ✂️</Text>
        <Text style={styles.headerSubtitle}>
          Growth takes root when we cut away what no longer serves us. Share a habit you're ready to prune today.
        </Text>
      </View>

      <Card style={styles.composerCard}>
        <Text style={styles.composerTitle}>Share a Habit to Prune</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Habit Name *</Text>
          <TextInput
            style={styles.textInput}
            value={habitName}
            onChangeText={setHabitName}
            placeholder="e.g., Scrolling social media before bed"
            placeholderTextColor={Colors.text.light}
            maxLength={100}
            testID="habit-name-input"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Why It Matters *</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={whyItMatters}
            onChangeText={setWhyItMatters}
            placeholder="Explain why pruning this habit is important for your growth..."
            placeholderTextColor={Colors.text.light}
            multiline
            numberOfLines={3}
            maxLength={280}
            testID="why-it-matters-input"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Strategy (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={strategy}
            onChangeText={setStrategy}
            placeholder="How will you replace or avoid this habit?"
            placeholderTextColor={Colors.text.light}
            multiline
            numberOfLines={2}
            maxLength={200}
            testID="strategy-input"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Severity</Text>
          <View style={styles.severityContainer}>
            {(['Low', 'Medium', 'High'] as Severity[]).map((severity) => (
              <TouchableOpacity
                key={severity}
                style={[
                  styles.severityChip,
                  selectedSeverity === severity && {
                    backgroundColor: getSeverityColor(severity),
                  },
                ]}
                onPress={() => setSelectedSeverity(severity)}
                testID={`severity-${severity.toLowerCase()}`}
              >
                <Text
                  style={[
                    styles.severityText,
                    selectedSeverity === severity && styles.severityTextSelected,
                  ]}
                >
                  {severity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.shareButton,
            (!habitName.trim() || !whyItMatters.trim() || isSubmitting) && styles.shareButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!habitName.trim() || !whyItMatters.trim() || isSubmitting}
          testID="share-habit-button"
        >
          <Scissors size={20} color={Colors.cardBackground} />
          <Text style={styles.shareButtonText}>
            {isSubmitting ? 'Sharing...' : 'Share Habit to Prune'}
          </Text>
        </TouchableOpacity>
      </Card>

      {pruningPosts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Shared Habits ({pruningPosts.length})</Text>
          {pruningPosts.map((post) => (
            <Card key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postHeaderLeft}>
                  <Scissors size={16} color={Colors.pruning.primary} />
                  <Text style={styles.postTimestamp}>{formatTimestamp(post.timestamp)}</Text>
                </View>
                <View style={[
                  styles.severityBadge,
                  { backgroundColor: getSeverityColor(post.severity) },
                ]}>
                  <Text style={styles.severityBadgeText}>{post.severity}</Text>
                </View>
              </View>
              
              <Text style={styles.postHabitName}>{post.habitName}</Text>
              <Text style={styles.postWhyItMatters}>{post.whyItMatters}</Text>
              
              {post.strategy && (
                <View style={styles.strategyContainer}>
                  <Text style={styles.strategyLabel}>Strategy:</Text>
                  <Text style={styles.strategyText}>{post.strategy}</Text>
                </View>
              )}
              
              <View style={styles.postFooter}>
                <Text style={styles.sharedIndicator}>✂️ Shared with friends for accountability</Text>
              </View>
            </Card>
          ))}
        </>
      )}

      {pruningPosts.length === 0 && (
        <Card style={styles.emptyStateCard}>
          <Text style={styles.emptyStateEmoji}>🌱</Text>
          <Text style={styles.emptyStateTitle}>Ready to Prune?</Text>
          <Text style={styles.emptyStateText}>
            Share your first habit to prune and start your accountability journey.
          </Text>
        </Card>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  composerCard: {
    marginBottom: 16,
  },
  composerTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.text.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.cardBackground,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top" as const,
  },
  severityContainer: {
    flexDirection: "row",
    gap: 8,
  },
  severityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.text.light,
    backgroundColor: Colors.cardBackground,
  },
  severityText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text.secondary,
  },
  severityTextSelected: {
    color: Colors.cardBackground,
  },
  shareButton: {
    backgroundColor: Colors.pruning.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  shareButtonDisabled: {
    backgroundColor: Colors.text.light,
    opacity: 0.6,
  },
  shareButtonText: {
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
    marginTop: 8,
  },
  postCard: {
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  postHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  postTimestamp: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "600" as const,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.cardBackground,
  },
  postHabitName: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  postWhyItMatters: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  strategyContainer: {
    backgroundColor: Colors.pruning.pale,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  strategyLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.pruning.primary,
    marginBottom: 4,
  },
  strategyText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 18,
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.pruning.pale,
    paddingTop: 8,
  },
  sharedIndicator: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: "italic" as const,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center" as const,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
