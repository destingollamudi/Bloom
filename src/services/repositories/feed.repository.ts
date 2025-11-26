import { BaseRepository } from './base.repository';
import { FeedPost } from '../../types';
import { apiClient, PaginatedResponse } from '../api/client';

export class FeedRepository extends BaseRepository<FeedPost> {
  protected endpoint = '/posts/feed';

  async getFeed(params?: { page?: number; limit?: number; cursor?: string }): Promise<PaginatedResponse<FeedPost>> {
    return apiClient.getPaginated<FeedPost>(this.endpoint, params);
  }

  async createPost(data: {
    type: 'bloom' | 'prune' | 'reflection';
    content: string;
    photoUrl?: string;
    visibility?: 'friends' | 'public' | 'private';
  }) {
    return apiClient.post<FeedPost>('/posts', data);
  }

  async reactToPost(postId: string, reactionType: 'growth' | 'applause' | 'love') {
    return apiClient.post(`/posts/${postId}/reactions`, { type: reactionType });
  }

  async removeReaction(postId: string) {
    return apiClient.delete(`/posts/${postId}/reactions`);
  }
}

export const feedRepository = new FeedRepository();