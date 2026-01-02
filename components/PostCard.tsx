'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthCheck } from '@/lib/hooks';
import type { PostWithAuthor } from '@/lib/models';

interface PostCardProps {
  post: PostWithAuthor;
  showDelete?: boolean;
  /**
   * Callback function called when a post is successfully deleted.
   * Receives the deleted post's ID as parameter.
   */
  onPostDeleted?: (postId: number) => void;
}

export function PostCard({ post, showDelete = true, onPostDeleted }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthCheck();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Use callback if provided (preferred approach for component composition)
      if (onPostDeleted) {
        await onPostDeleted(post.id);
        toast.success('Post deleted successfully!');
        setShowModal(false);
      } else {
        // Fallback: direct API call (for standalone usage)
        const response = await fetch(`/api/posts/${post.id}`, {
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

        // Show success notification
        toast.success('Post deleted successfully!');
        router.refresh();
        setShowModal(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(`Failed to delete post: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 capitalize">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              By: {post.user.name} (@{post.user.username})
            </p>
          </div>
          {showDelete && isAuthenticated && (
            <button
              onClick={() => setShowModal(true)}
              className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors cursor-pointer"
              disabled={isDeleting}
            >
              Delete
            </button>
          )}
        </div>

        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{post.body}</p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the post &quot;{post.title}&quot;? This action cannot be undone.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors cursor-pointer"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 rounded-md transition-colors cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}