'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface UseDeletePostReturn {
  deletePost: (postId: number) => Promise<{ success: boolean }>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for handling post deletion logic
 * Separates API concerns from UI components
 */
export function useDeletePost(): UseDeletePostReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePost = useCallback(async (postId: number) => {
    setIsLoading(true);
    setError(null);

    try {
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

      toast.success('Post deleted successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post';
      setError(errorMessage);
      toast.error(`Failed to delete post: ${errorMessage}`);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deletePost,
    isLoading,
    error,
    clearError,
  };
}
