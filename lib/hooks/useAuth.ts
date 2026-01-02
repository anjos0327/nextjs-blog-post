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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
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
  }, []); // Remove checkAuth dependency to avoid infinite loops

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refresh,
  };
}
