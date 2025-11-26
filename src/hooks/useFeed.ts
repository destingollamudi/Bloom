import { usePaginatedQuery } from './usePaginatedQuery';
import { feedRepository } from '../services/repositories';
import { FeedPost } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api/client';

export function useFeed() {
  const queryClient = useQueryClient();

  const feedQuery = usePaginatedQuery<FeedPost>({
    queryKey: ['feed'],
    queryFn: ({ page, limit }) => feedRepository.getFeed({ page, limit }),
  });

  const createPostMutation = useMutation({
    mutationFn: (data: {
      type: 'bloom' | 'prune' | 'reflection';
      content: string;
      photoUrl?: string;
      visibility?: 'friends' | 'public' | 'private';
    }) => feedRepository.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  const reactToPostMutation = useMutation({
    mutationFn: ({ postId, reactionType }: { postId: string; reactionType: 'growth' | 'applause' | 'love' }) =>
      feedRepository.reactToPost(postId, reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });

  return {
    feed: feedQuery.data?.pages.flatMap((page) => page.data) || [],
    isLoading: feedQuery.isLoading,
    isFetchingNextPage: feedQuery.isFetchingNextPage,
    hasNextPage: feedQuery.hasNextPage,
    fetchNextPage: feedQuery.fetchNextPage,
    refetch: feedQuery.refetch,
    createPost: createPostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
    reactToPost: reactToPostMutation.mutate,
    isReacting: reactToPostMutation.isPending,
  };
}