'use client';

interface UserSkeletonProps {
  className?: string;
}

export function UserSkeleton({ className = '' }: UserSkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
    </div>
  );
}

// Skeleton for user filter options
export function UserFilterSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, index) => (
        <UserSkeleton key={index} className="px-3 py-1" />
      ))}
    </div>
  );
}
