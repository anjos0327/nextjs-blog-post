'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { PostWithAuthor, PostFilters } from '@/lib/models';

/**
 * Custom hook for managing posts state and operations
 * Follows Single Responsibility Principle: only handles posts-related state and effects
 */
export function usePosts(initialFilters?: PostFilters) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PostFilters>(initialFilters || {});
  const filtersRef = useRef<PostFilters>(initialFilters || {});

  // Sync ref with state
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  /**
   * Fetch posts from API
   */
  const fetchPosts = useCallback(async (overrideFilters?: PostFilters) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      const activeFilters = overrideFilters || filtersRef.current;

      if (activeFilters.userId) {
        queryParams.set('userId', activeFilters.userId.toString());
      }

      const response = await fetch(`/api/posts?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
      console.error('Error fetching posts:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Remove filters dependency to avoid loops

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
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
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
          errorMessage = `Failed to delete post (${response.status})`;
        }
      } catch {
        // If we can't parse JSON, try to get text response
        try {
          const textResponse = await response.text();
          if (textResponse) {
            errorMessage = textResponse;
          } else {
            errorMessage = `Failed to delete post (${response.status})`;
          }
        } catch {
          errorMessage = `Failed to delete post (${response.status})`;
        }
      }

      throw new Error(errorMessage);
    }

    // Remove post from the list - success
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  /**
   * Update filters and refetch posts
   */
  const updateFilters = useCallback((newFilters: Partial<PostFilters>) => {
    const updatedFilters = { ...filtersRef.current, ...newFilters };
    filtersRef.current = updatedFilters;
    setFilters(updatedFilters);

    // Fetch posts directly without using the callback to avoid dependency loop
    const fetchPostsDirectly = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();

        if (updatedFilters.userId) {
          queryParams.set('userId', updatedFilters.userId.toString());
        }

        const response = await fetch(`/api/posts?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load posts';
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
    error,
    filters,
    fetchPosts,
    createPost,
    deletePost,
    updateFilters,
    clearError,
    refresh,
  };
}
