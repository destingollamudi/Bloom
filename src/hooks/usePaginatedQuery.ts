import { useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedResponse } from '../services/api/client';

export interface UsePaginatedQueryOptions<T> {
  queryKey: string[];
  queryFn: (params: { page: number; limit: number; cursor?: string }) => Promise<PaginatedResponse<T>>;
  limit?: number;
  enabled?: boolean;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  limit = 20,
  enabled = true,
}: UsePaginatedQueryOptions<T>) {
  return useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      return queryFn({ page: pageParam, limit });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.nextCursor || lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });
}