import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../components';
import { Colors } from '../constants';
import { useUser, type UserProfile } from '../contexts';
import { Search, UserPlus, UserMinus, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockUsers } from '../constants/mockData';
import { formatJoinDate } from '../utils';

export default function SearchUsersScreen() {
  const insets = useSafeAreaInsets();
  const { following, followUser, unfollowUser } = useUser();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>(mockUsers);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredUsers(mockUsers);
    } else {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const handleFollowToggle = async (userId: string) => {
    const isFollowing = following.includes(userId);
    
    if (isFollowing) {
      await unfollowUser(userId);
      Alert.alert('Unfollowed', 'You are no longer following this user.');
    } else {
      await followUser(userId);
      Alert.alert('Following', 'You are now following this user!');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover Friends</Text>
      </View>

      {/* Search Input */}
      <Card style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or username..."
            placeholderTextColor={Colors.text.secondary}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>
      </Card>

      {/* Users List */}
      <Text style={styles.sectionTitle}>
        {searchQuery ? `Results for "${searchQuery}"` : 'Suggested Friends'}
      </Text>

      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => {
          const isFollowing = following.includes(user.id);
          
          return (
            <Card key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.avatar}>
                  {user.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                  ) : (
                    <Text style={styles.avatarText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  )}
                </View>
                
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userUsername}>@{user.username}</Text>
                  <Text style={styles.userJoinDate}>
                    Joined {formatJoinDate(user.joinDate)}
                  </Text>
                  
                  <View style={styles.userStats}>
                    <Text style={styles.statText}>
                      {user.followers.length} followers
                    </Text>
                    <Text style={styles.statDivider}>•</Text>
                    <Text style={styles.statText}>
                      {user.following.length} following
                    </Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followingButton
                ]}
                onPress={() => handleFollowToggle(user.id)}
                activeOpacity={0.7}
              >
                {isFollowing ? (
                  <>
                    <UserMinus size={16} color={Colors.text.secondary} />
                    <Text style={styles.followingButtonText}>Following</Text>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} color={Colors.cardBackground} />
                    <Text style={styles.followButtonText}>Follow</Text>
                  </>
                )}
              </TouchableOpacity>
            </Card>
          );
        })
      ) : (
        <Card style={styles.emptyStateCard}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No users found</Text>
          <Text style={styles.emptyStateText}>
            Try searching with different keywords or check back later for new users.
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
  },
  searchCard: {
    marginBottom: 16,
  },
  searchContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  userCard: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.garden.pale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.garden.primary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  userJoinDate: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statDivider: {
    fontSize: 12,
    color: Colors.text.light,
  },
  followButton: {
    backgroundColor: Colors.garden.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  followingButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.text.light,
  },
  followButtonText: {
    color: Colors.cardBackground,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  followingButtonText: {
    color: Colors.text.secondary,
    fontSize: 14,
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
  },
  bottomSpacing: {
    height: 20,
  },
});
