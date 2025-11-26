import { BaseRepository } from './base.repository';
import { UserProfile } from '../../types';
import { apiClient, PaginatedResponse } from '../api/client';

export interface SearchUsersParams {
  query: string;
  page?: number;
  limit?: number;
}

export class UserRepository extends BaseRepository<UserProfile> {
  
  protected endpoint = '/users';

  async searchUsers(params: SearchUsersParams): Promise<PaginatedResponse<UserProfile>> {
    return apiClient.getPaginated<UserProfile>('/users/search', params);
  }

  async getUserProfile(userId: string) {
    return apiClient.get<UserProfile>(`/users/${userId}`);
  }

  async followUser(userId: string) {
    return apiClient.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId: string) {
    return apiClient.delete(`/users/${userId}/follow`);
  }
}

export const userRepository = new UserRepository();