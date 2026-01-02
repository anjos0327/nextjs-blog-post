"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { PostFilter } from "@/components/PostFilter";
import { CreatePostModal } from "@/components/CreatePostModal";
import { usePosts, useUsers, useAuthCheck } from "@/lib/hooks";

export default function PostsPage() {
  const searchParams = useSearchParams();
  const currentUserId = searchParams.get("userId") || undefined;

  // Use custom hooks for state management
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    createPost,
    deletePost,
    updateFilters,
    clearError,
    refresh,
  } = usePosts();

  const { users, error: usersError } = useUsers();
  const { isAuthenticated } = useAuthCheck();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Initial fetch and update filters when currentUserId changes
  useEffect(() => {
    updateFilters({
      userId: currentUserId ? parseInt(currentUserId) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId]); // Remove updateFilters from dependencies to avoid infinite loop

  const handlePostCreated = async (postData: {
    title: string;
    body: string;
  }) => {
    try {
      await createPost(postData);
      setShowCreateModal(false);
    } catch {
      // Error is handled by the hook
    }
  };

  const handlePostDeleted = async (postId: number) => {
    try {
      await deletePost(postId);
    } catch {
      // Error is handled by the hook
    }
  };

  if (postsLoading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">
              Loading posts...
            </p>
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
                  clearError();
                  refresh();
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
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium rounded-md transition-colors cursor-pointer"
              >
                Create Post
              </button>
            )}
          </div>
          <div className="mt-4">
            <PostFilter users={users} currentUserId={currentUserId} />
          </div>
        </div>

        {/* Show users error warning if applicable */}
        {usersError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
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
              <PostCard
                key={post.id}
                post={post}
                onPostDeleted={handlePostDeleted}
              />
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
