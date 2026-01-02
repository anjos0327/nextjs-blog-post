'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PostWithAuthor, PostFilters, PostListResponse } from '@/lib/models';

/**
 * Custom hook for managing posts state and operations
 * Follows Single Responsibility Principle: only handles posts-related state and effects
 */
export function usePosts(initialFilters?: PostFilters) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostFilters>(initialFilters || {});
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const filtersRef = useRef<PostFilters>(initialFilters || {});

  // Sync ref with state
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  /**
   * Fetch initial posts from API (resets pagination)
   */
  const fetchPosts = useCallback(async (overrideFilters?: PostFilters) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      const queryParams = new URLSearchParams();
      const activeFilters = overrideFilters || filtersRef.current;

      if (activeFilters.userId) {
        queryParams.set('userId', activeFilters.userId.toString());
      }
      queryParams.set('page', '1');
      queryParams.set('limit', (activeFilters.limit || 10).toString());

      const response = await fetch(`/api/posts?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch posts');
      }

      const data: PostListResponse = await response.json();
      setPosts(data.posts);
      setHasMore(data.hasMore);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to load posts. Please check your connection and try again.';
      console.error('Error fetching posts:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Remove filters dependency to avoid loops

  /**
   * Load more posts for infinite scroll
   */
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      setError(null);

      const queryParams = new URLSearchParams();
      const activeFilters = filtersRef.current;
      const nextPage = currentPage + 1;

      if (activeFilters.userId) {
        queryParams.set('userId', activeFilters.userId.toString());
      }
      queryParams.set('page', nextPage.toString());
      queryParams.set('limit', (activeFilters.limit || 10).toString());

      const response = await fetch(`/api/posts?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load more posts');
      }

      const data: PostListResponse = await response.json();

      // Append new posts to existing ones
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setHasMore(data.hasMore);
      setCurrentPage(nextPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to load more posts. Please try again.';
      console.error('Error loading more posts:', err);
      setError(errorMessage);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, currentPage]);

  /**
   * Create a new post
   */
  const createPost = useCallback(async (postData: { title: string; body: string }) => {
    try {
      setError(null);

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create post');
      }

      const newPost = await response.json();

      // Add new post to the list
      setPosts(prevPosts => [newPost.post, ...prevPosts]);

      return newPost.post;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to create post. Please check your input and try again.';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Delete a post
   */
  const deletePost = useCallback(async (postId: number) => {
    // Note: We don't set global error state for individual post deletions
    // Each PostCard component handles its own deletion errors via toast notifications

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete post';

      // Try to get specific error message from server
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
      } else {
        errorMessage = 'Failed to delete post';
      }
    } catch {
      // If we can't parse JSON, try to get text response
      try {
        const textResponse = await response.text();
        if (textResponse) {
          errorMessage = textResponse;
        } else {
          errorMessage = 'Failed to delete post';
        }
      } catch {
        errorMessage = 'Failed to delete post';
      }
      }

      throw new Error(errorMessage);
    }

    // Remove post from the list - success
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  /**
   * Update filters and refetch posts (resets pagination)
   */
  const updateFilters = useCallback((newFilters: Partial<PostFilters>) => {
    const updatedFilters = { ...filtersRef.current, ...newFilters };
    filtersRef.current = updatedFilters;
    setFilters(updatedFilters);
    setCurrentPage(1);
    setHasMore(true);

    // Fetch posts directly without using the callback to avoid dependency loop
    const fetchPostsDirectly = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();

        if (updatedFilters.userId) {
          queryParams.set('userId', updatedFilters.userId.toString());
        }
        queryParams.set('page', '1');
        queryParams.set('limit', (updatedFilters.limit || 10).toString());

        const response = await fetch(`/api/posts?${queryParams.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch posts');
        }

        const data: PostListResponse = await response.json();
        setPosts(data.posts);
        setHasMore(data.hasMore);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unable to load posts. Please try again.';
        console.error('Error fetching posts:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPostsDirectly();
  }, []); // No dependencies - uses ref instead

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh posts
   */
  const refresh = useCallback(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove fetchPosts dependency to avoid infinite loop

  // No initial fetch - let the component control when to fetch

  return {
    posts,
    loading,
    loadingMore,
    error,
    filters,
    hasMore,
    fetchPosts,
    loadMorePosts,
    createPost,
    deletePost,
    updateFilters,
    clearError,
    refresh,
  };
}
