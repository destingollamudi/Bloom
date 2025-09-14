import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components';
import { Colors } from '../constants';
import { useUser, type FeedPost } from '../contexts';
import { Search, UserPlus, Heart, ThumbsUp, Sprout, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { formatTimestamp, getTypeIcon, getTypeBadge, truncateText } from '../utils';

export default function FriendsFeedScreen() {
  const insets = useSafeAreaInsets();
  const { feedPosts, reactToPost, currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleReaction = async (postId: string, reactionType: 'growth' | 'applause' | 'love') => {
    await reactToPost(postId, reactionType);
  };

  const handleSearchUsers = () => {
    router.push('/search-users');
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends Feed 🌿</Text>
        <Text style={styles.headerSubtitle}>
          See what your friends are blooming and pruning
        </Text>
      </View>

      {/* Search and Discover */}
      <Card style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor={Colors.text.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchUsers}
            activeOpacity={0.7}
          >
            <UserPlus size={20} color={Colors.cardBackground} />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Feed Posts */}
      {feedPosts.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {feedPosts.map((post) => (
            <Card key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorInfo}>
                  <View style={styles.avatar}>
                    {post.userAvatar ? (
                      <Image source={{ uri: post.userAvatar }} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarText}>
                        {(post.userName || 'A').charAt(0).toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.authorDetails}>
                    <Text style={styles.authorName}>{post.userName}</Text>
                    <View style={styles.postMeta}>
                      <Text style={styles.typeBadge}>
                        {getTypeIcon(post.type)} {getTypeBadge(post.type)}
                      </Text>
                      <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {post.photoUrl && (
                <Image source={{ uri: post.photoUrl }} style={styles.postImage} />
              )}
              
              <Text style={styles.postContent}>
                {truncateText(post.content)}
              </Text>
              
              <View style={styles.reactionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.reactionButton,
                    post.reactions.growth.includes(currentUser?.uid || '') && styles.reactionButtonActive
                  ]}
                  onPress={() => handleReaction(post.id, 'growth')}
                  activeOpacity={0.7}
                >
                  <Sprout size={16} color={Colors.garden.primary} />
                  <Text style={styles.reactionCount}>{post.reactions.growth.length}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.reactionButton,
                    post.reactions.applause.includes(currentUser?.uid || '') && styles.reactionButtonActive
                  ]}
                  onPress={() => handleReaction(post.id, 'applause')}
                  activeOpacity={0.7}
                >
                  <ThumbsUp size={16} color={Colors.blooming.primary} />
                  <Text style={styles.reactionCount}>{post.reactions.applause.length}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.reactionButton,
                    post.reactions.love.includes(currentUser?.uid || '') && styles.reactionButtonActive
                  ]}
                  onPress={() => handleReaction(post.id, 'love')}
                  activeOpacity={0.7}
                >
                  <Heart size={16} color={Colors.pruning.primary} />
                  <Text style={styles.reactionCount}>{post.reactions.love.length}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.commentButton}
                  onPress={() => Alert.alert('Comments', 'Comments feature coming soon!')}
                  activeOpacity={0.7}
                >
                  <MessageCircle size={16} color={Colors.text.secondary} />
                  <Text style={styles.commentText}>Comment</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </>
      ) : (
        <Card style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>🌱</Text>
          <Text style={styles.emptyStateTitle}>Your feed is quiet</Text>
          <Text style={styles.emptyStateText}>
            Follow friends to see their blooms and pruning progress.
          </Text>
          <TouchableOpacity 
            style={styles.discoverButton}
            onPress={handleSearchUsers}
            activeOpacity={0.7}
          >
            <UserPlus size={20} color={Colors.cardBackground} />
            <Text style={styles.discoverButtonText}>Discover Friends</Text>
          </TouchableOpacity>
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
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  searchCard: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.text.light,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  searchButton: {
    backgroundColor: Colors.garden.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  postCard: {
    marginBottom: 12,
  },
  postHeader: {
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.garden.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.garden.primary,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600' as const,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.background,
  },
  postContent: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.text.light,
    gap: 16,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background,
    gap: 4,
  },
  reactionButtonActive: {
    backgroundColor: Colors.garden.pale,
  },
  reactionCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600' as const,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background,
    gap: 4,
    marginLeft: 'auto',
  },
  commentText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600' as const,
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: 20,
  },
  discoverButton: {
    backgroundColor: Colors.garden.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  discoverButtonText: {
    color: Colors.cardBackground,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  bottomSpacing: {
    height: 20,
  },
});
