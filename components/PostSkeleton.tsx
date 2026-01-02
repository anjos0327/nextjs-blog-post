'use client';

interface PostSkeletonProps {
  className?: string;
}

export function PostSkeleton({ className = '' }: PostSkeletonProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse ${className}`}>
      {/* Header with avatar and name */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          {/* Author info skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        {/* Delete button skeleton */}
        <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-4"></div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>

      {/* Optional error state skeleton */}
      <div className="h-12 bg-red-50 dark:bg-red-900/20 rounded-md"></div>
    </div>
  );
}

// Skeleton for a grid of posts
export function PostsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}
