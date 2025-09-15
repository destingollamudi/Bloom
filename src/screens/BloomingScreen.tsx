import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  TextInput,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "../components";
import { Colors } from "../constants";
import { useUser } from "../contexts";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Camera, X } from "lucide-react-native";
import { wisdomQuotes } from "../constants/mockData";

export default function BloomingScreen() {
  const insets = useSafeAreaInsets();
  const { bloomingPosts, addBloomingPost, getCurrentStreak, getBestStreak } = useUser();
  const [caption, setCaption] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentWisdom, setCurrentWisdom] = useState<string>("");

  const currentStreak = getCurrentStreak();
  const bestStreak = getBestStreak();

  useEffect(() => {
    const randomWisdom = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)];
    setCurrentWisdom(randomWisdom.text);
  }, []);

  const handleShareProgress = async () => {
    if (!selectedImage && !caption.trim()) {
      console.log("Please add a photo or write a caption to share your progress!");
      return;
    }

    if (caption.trim().length > 280) {
      console.log("Please keep your caption under 280 characters.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addBloomingPost(caption || "Shared a moment 🌸", selectedImage || undefined);
      setCaption("");
      setSelectedImage(null);
      
      if (Platform.OS !== "web") {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error sharing progress:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permission required to access photo library');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
  };

  const handleReaction = (postId: string, reactionType: 'growth' | 'applause' | 'love') => {
    console.log(`Reacted to post ${postId} with ${reactionType}`);
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permission required to access camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return "Yesterday";
      } else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { 
        paddingTop: insets.top,
        paddingBottom: Platform.OS === 'ios' ? insets.bottom + 80 : 80
      }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Share Your Blooms</Text>
        <Text style={styles.headerSubtitle}>
          Celebrate your wins, big and small 🌸
        </Text>
      </View>

      <Card style={styles.streakCard}>
        <Text style={styles.streakTitle}>Your Bloom Streak 🌸</Text>
        {currentStreak === 0 ? (
          <Text style={styles.streakText}>
            No streak yet — share your first bloom today!
          </Text>
        ) : (
          <Text style={styles.streakText}>
            You&apos;re on a {currentStreak}-day streak! Keep blooming 🌱
          </Text>
        )}
        <Text style={styles.bestStreakText}>
          Best Streak: {bestStreak} days
        </Text>
      </Card>

      <Card style={styles.wisdomCard}>
        <Text style={styles.wisdomTitle}>Blooming Wisdom ✨</Text>
        <Text style={styles.wisdomText}>{currentWisdom}</Text>
      </Card>

      <Card>
        {selectedImage ? (
          <View style={styles.imageFirstContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeSelectedImage}
              activeOpacity={0.7}
            >
              <X size={16} color={Colors.cardBackground} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoOptions}>
            <TouchableOpacity
              style={styles.photoOption}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <Camera size={24} color={Colors.blooming.primary} />
              <Text style={styles.photoOptionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.photoOption}
              onPress={handleImagePicker}
              activeOpacity={0.7}
            >
              <Text style={styles.photoOptionEmoji}>📷</Text>
              <Text style={styles.photoOptionText}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TextInput
          style={styles.captionInput}
          placeholder="Share a small win..."
          placeholderTextColor={Colors.text.secondary}
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={280}
          textAlignVertical="top"
        />
        
        <View style={styles.inputFooter}>
          <Text style={styles.autoShareText}>📤 Auto-shared with friends</Text>
          <Text style={styles.characterCount}>
            {caption.length}/280
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.shareButton,
            (!selectedImage && !caption.trim()) || isSubmitting ? styles.shareButtonDisabled : null
          ]}
          onPress={handleShareProgress}
          disabled={(!selectedImage && !caption.trim()) || isSubmitting}
          activeOpacity={0.7}
        >
          <Text style={styles.shareButtonText}>
            {isSubmitting ? "Sharing..." : "Share Progress"}
          </Text>
        </TouchableOpacity>
      </Card>

      {bloomingPosts.length > 0 && (
        <Text style={styles.sectionTitle}>Your Recent Blooms</Text>
      )}

      {bloomingPosts.map((post) => (
        <Card key={post.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Text style={styles.postBadge}>🌸</Text>
            <Text style={styles.postDate}>{formatDate(post.timestamp)}</Text>
          </View>
          
          {post.photoUrl && (
            <Image source={{ uri: post.photoUrl }} style={styles.postImage} />
          )}
          
          {post.caption && (
            <Text style={styles.postCaption}>{post.caption}</Text>
          )}
          
          <View style={styles.reactionsContainer}>
            <TouchableOpacity 
              style={styles.reactionButton}
              onPress={() => handleReaction(post.id, 'growth')}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>🌱</Text>
              <Text style={styles.reactionCount}>{post.reactions.growth}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reactionButton}
              onPress={() => handleReaction(post.id, 'applause')}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>👏</Text>
              <Text style={styles.reactionCount}>{post.reactions.applause}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.reactionButton}
              onPress={() => handleReaction(post.id, 'love')}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>💜</Text>
              <Text style={styles.reactionCount}>{post.reactions.love}</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ))}

      {bloomingPosts.length === 0 && (
        <Card style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>🌱</Text>
          <Text style={styles.emptyStateTitle}>Ready to bloom?</Text>
          <Text style={styles.emptyStateText}>
            Share your first photo and caption above to start your blooming journey!
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
    backgroundColor: Colors.blooming.header,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  streakCard: {
    marginTop: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  streakText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 8,
    lineHeight: 22,
  },
  bestStreakText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.blooming.pale,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 80,
    backgroundColor: Colors.background,
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.blooming.pale,
  },
  imageButtonText: {
    fontSize: 14,
    color: Colors.blooming.button,
    marginLeft: 6,
    fontWeight: "500" as const,
  },
  imagePreviewContainer: {
    position: "relative",
    marginTop: 12,
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: Colors.background,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  shareButton: {
    backgroundColor: Colors.blooming.button,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  shareButtonDisabled: {
    backgroundColor: Colors.text.light,
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
    marginTop: 24,
  },
  postCard: {
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  postIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  postDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  postText: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: 32,
    marginTop: 16,
  },
  emptyStateIcon: {
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
    textAlign: "center",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  wisdomCard: {
    marginTop: 16,
    backgroundColor: Colors.blooming.pale,
  },
  wisdomTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  wisdomText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    fontStyle: "italic" as const,
  },
  imageFirstContainer: {
    position: "relative",
    marginBottom: 12,
  },
  photoOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  photoOption: {
    flex: 1,
    height: 80,
    borderWidth: 2,
    borderColor: Colors.blooming.pale,
    borderStyle: "dashed" as const,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.blooming.pale,
  },
  photoOptionText: {
    fontSize: 12,
    color: Colors.blooming.primary,
    marginTop: 4,
    fontWeight: "500" as const,
  },
  photoOptionEmoji: {
    fontSize: 24,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: Colors.blooming.pale,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text.primary,
    minHeight: 60,
    backgroundColor: Colors.background,
  },
  autoShareText: {
    fontSize: 12,
    color: Colors.blooming.primary,
    fontWeight: "500" as const,
  },
  postBadge: {
    fontSize: 16,
    marginRight: 8,
  },
  postCaption: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
    marginTop: 8,
  },
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.blooming.pale,
  },
  reactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  reactionEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "500" as const,
  },
});
