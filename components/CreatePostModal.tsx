"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "@/lib/hooks";
import { validatePostInput } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (postData: { title: string; body: string }) => Promise<void>;
}

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const router = useRouter();

  // Validation function that returns the format expected by useForm
  const validateForm = (formData: { title: string; body: string }): Record<string, string> => {
    const result = validatePostInput(formData);
    const errors: Record<string, string> = {};

    // Map validation errors to field-specific messages
    if (!result.isValid) {
      // For simplicity, we'll assign errors to specific fields based on content
      // In a more complex scenario, you'd modify validatePostInput to return field-specific errors
      if (result.errors.some(error => error.includes('Title'))) {
        errors.title = result.errors.find(error => error.includes('Title')) || 'Title error';
      }
      if (result.errors.some(error => error.includes('Content'))) {
        errors.body = result.errors.find(error => error.includes('Content')) || 'Content error';
      }
      // If we can't map specific errors, put them in a general field
      if (Object.keys(errors).length === 0 && result.errors.length > 0) {
        errors.title = result.errors[0]; // Default to title for backwards compatibility
      }
    }

    return errors;
  };

  const { data, errors, isSubmitting, isValid, setValue, submit } = useForm(
    { title: "", body: "" },
    validateForm
  );

  const handleSubmit = async () => {
    if (onPostCreated) {
      await onPostCreated({
        title: data.title.trim(),
        body: data.body.trim(),
      });
      // Toast is handled by the parent component
      onClose();
    } else {
      // Fallback to direct API call if no callback provided
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title.trim(),
            body: data.body.trim(),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create post");
        }

        toast.success("Post created successfully");
        onClose();
        router.refresh();
      } catch (error) {
        console.error("Error creating post:", error);
        toast.error(
          error instanceof Error ? error.message : "Unable to create post. Please check your input and try again."
        );
      }
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form data when modal closes
      setValue('title', '');
      setValue('body', '');
    }
  }, [isOpen, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Post
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(handleSubmit);
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={data.title}
                onChange={(e) => setValue("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter post title..."
                required
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Content *
              </label>
              <textarea
                id="body"
                value={data.body}
                onChange={(e) => setValue("body", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white resize-vertical"
                placeholder="Write your post content here..."
                required
                disabled={isSubmitting}
              />
              {errors.body && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.body}
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 cursor-pointer hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
