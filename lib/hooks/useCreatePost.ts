'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import type { CreatePostInput, PostWithAuthor } from '@/lib/models';

interface UseCreatePostReturn {
    createPost: (postData: CreatePostInput) => Promise<{ success: boolean; post?: PostWithAuthor }>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

/**
 * Custom hook for handling post creation logic
 * Separates API concerns from UI components
 */
export function useCreatePost(): UseCreatePostReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createPost = useCallback(async (postData: CreatePostInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to create post');
            }

            const result = await response.json();
            toast.success('Post created successfully');

            return { success: true, post: result.post };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unable to create post. Please check your input and try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        createPost,
        isLoading,
        error,
        clearError,
    };
}
