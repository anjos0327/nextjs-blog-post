"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface User {
  id: number;
  name: string;
  username: string;
}

interface PostFilterProps {
  users: User[];
  currentUserId?: string;
}

export function PostFilter({ users, currentUserId }: PostFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUserChange = (userId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (userId === "all") {
      params.delete("userId");
    } else {
      params.set("userId", userId);
    }

    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <label
        htmlFor="user-filter"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Filter by User:
      </label>
      <select
        id="user-filter"
        value={currentUserId || "all"}
        onChange={(e) => handleUserChange(e.target.value)}
        className="block w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
      >
        <option value="all">All Users</option>
        {users.map((user) => (
          <option key={user.id} value={user.id.toString()}>
            {user.name} ({user.username})
          </option>
        ))}
      </select>
      {currentUserId && (
        <button
          onClick={() => handleUserChange("all")}
          className="text-sm text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Clear filter
        </button>
      )}
    </div>
  );
}
