import { apiClient, ApiResponse, PaginatedResponse } from '../api/client';

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export abstract class BaseRepository<T> {
  protected abstract endpoint: string;

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    return apiClient.getPaginated<T>(this.endpoint, params);
  }

  async getById(id: string): Promise<ApiResponse<T>> {
    return apiClient.get<T>(`${this.endpoint}/${id}`);
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return apiClient.post<T>(this.endpoint, data);
  }

  async update(id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return apiClient.put<T>(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`);
  }
}