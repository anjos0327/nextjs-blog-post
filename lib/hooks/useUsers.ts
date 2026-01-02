'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/models';

/**
 * Custom hook for managing users state and operations
 * Follows Single Responsibility Principle: only handles users-related state and effects
 */
export function useUsers() {
  const [users, setUsers] = useState<Pick<User, 'id' | 'name' | 'username'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch users from API
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unable to load user list. Please try again.';
      console.error('Error fetching users:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh users
   */
  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    clearError,
    refresh,
  };
}
