"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDeletePost } from "@/lib/hooks";
import type { PostWithAuthor } from "@/lib/models";

interface PostCardProps {
  post: PostWithAuthor;
  showDelete?: boolean;
  isAuthenticated?: boolean;
  /**
   * Callback function called when a post is successfully deleted.
   * Receives the deleted post's ID as parameter.
   */
  onPostDeleted?: (postId: number) => void;
}

export function PostCard({
  post,
  showDelete = true,
  isAuthenticated = false,
  onPostDeleted,
}: PostCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { deletePost: deletePostDirect, isLoading: isDeleting } =
    useDeletePost();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      // Use callback if provided (preferred approach for component composition)
      if (onPostDeleted) {
        await onPostDeleted(post.id);
        toast.success("Post deleted successfully");
        setShowModal(false);
      } else {
        // Use the custom hook for direct API call
        const result = await deletePostDirect(post.id);

        if (result.success) {
          router.refresh();
          setShowModal(false);
        }
        // Error handling is done by the hook (toast notifications)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(`Failed to delete post: ${errorMessage}`);
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

        <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
          {post.body}
        </p>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the post &quot;{post.title}&quot;?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
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
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
