'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/models';

/**
 * Custom hook for managing authentication state and operations
 * Follows Single Responsibility Principle: only handles auth-related state and effects
 */
export function useAuthCheck() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData && userData.id) {
          // Valid user data
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // No valid user data
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Import toast dynamically to avoid SSR issues
      const toast = (await import('react-hot-toast')).default;
      toast.success('You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      // Import toast dynamically to avoid SSR issues
      const toast = (await import('react-hot-toast')).default;
      toast.error('Failed to log out. Please try again.');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoggingOut(false);
    }
  }, []);

  /**
   * Refresh authentication status
   */
  const refresh = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    isLoading,
    isLoggingOut,
    isAuthenticated,
    login,
    logout,
    refresh,
  };
}
