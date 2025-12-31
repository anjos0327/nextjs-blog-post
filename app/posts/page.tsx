'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { PostCard } from "@/components/PostCard";
import { PostFilter } from "@/components/PostFilter";
import { CreatePostModal } from "@/components/CreatePostModal";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  user: {
    name: string;
    username: string;
  };
}

interface User {
  id: number;
  name: string;
  username: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const currentUserId = searchParams.get('userId') || undefined;

  const fetchPosts = useCallback(async () => {
    try {
      setPostsError(null);
      const postsResponse = await fetch(`/api/posts?userId=${currentUserId || ''}`);

      if (!postsResponse.ok) {
        throw new Error(`Failed to fetch posts: ${postsResponse.status} ${postsResponse.statusText}`);
      }

      const postsData = await postsResponse.json();
      setPosts(postsData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load posts';
      console.error('Error fetching posts:', error);
      setPostsError(errorMessage);
    }
  }, [currentUserId]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setPostsError(null);
        setUsersError(null);

        // Fetch posts
        await fetchPosts();

        // Fetch users
        try {
          const usersResponse = await fetch('/api/users');
          if (!usersResponse.ok) {
            throw new Error(`Failed to fetch users: ${usersResponse.status} ${usersResponse.statusText}`);
          }
          const usersData = await usersResponse.json();
          setUsers(usersData);
        } catch (usersFetchError) {
          const errorMessage = usersFetchError instanceof Error ? usersFetchError.message : 'Failed to load users';
          console.error('Error fetching users:', usersFetchError);
          setUsersError(errorMessage);
        }

        // Check if user is logged in
        try {
          const authResponse = await fetch('/api/auth/me');
          setIsLoggedIn(authResponse.ok);
        } catch (authError) {
          console.error('Error checking authentication:', authError);
          // Authentication errors don't prevent the page from working
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUserId, fetchPosts]);

  const handlePostCreated = async () => {
    await fetchPosts();
  };

  const handlePostDeleted = async () => {
    setPostsError(null); // Clear any previous errors
    await fetchPosts();
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if posts failed to load
  if (postsError) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                Failed to Load Posts
              </h2>
              <p className="text-red-600 dark:text-red-400 mb-4">
                {postsError}
              </p>
              <button
                onClick={() => {
                  setPostsError(null);
                  fetchPosts();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Blog Posts
            </h1>
            {isLoggedIn && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium rounded-md transition-colors cursor-pointer"
              >
                Create Post
              </button>
            )}
          </div>
          <div className="mt-4">
            <PostFilter
              users={users}
              currentUserId={currentUserId}
            />
          </div>
        </div>

        {/* Show users error warning if applicable */}
        {usersError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Unable to load user filter options: {usersError}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {currentUserId
                ? "No posts found for this user."
                : "No posts found."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onPostDeleted={handlePostDeleted} />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
