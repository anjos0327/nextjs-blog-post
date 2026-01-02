'use client';

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/lib/auth-context';

interface SignupData {
  email: string;
  name: string;
  username: string;
}

interface UseSignupReturn {
  signup: (data: SignupData) => Promise<{ success: boolean }>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Custom hook for handling user signup logic
 * Separates API concerns from UI components
 */
export function useSignup(): UseSignupReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const signup = useCallback(async (formData: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call signup API
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for including cookies
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Account created successfully! Welcome to BlogApp.');

        const loginSuccess = await login(formData.email);
        if (!loginSuccess) {
          toast('Account created but please log in manually.');
        }

        return { success: true };
      } else {
        throw new Error(data.error || 'An error occurred during registration');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signup,
    isLoading,
    error,
    clearError,
  };
}
