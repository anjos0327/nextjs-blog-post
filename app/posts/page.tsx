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
  const searchParams = useSearchParams();
  const currentUserId = searchParams.get('userId') || undefined;

  const fetchPosts = useCallback(async () => {
    try {
      const postsResponse = await fetch(`/api/posts?userId=${currentUserId || ''}`);
      const postsData = await postsResponse.json();
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [currentUserId]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch posts
        await fetchPosts();

        // Fetch users
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Check if user is logged in
        const authResponse = await fetch('/api/auth/me');
        setIsLoggedIn(authResponse.ok);
      } catch (error) {
        console.error('Error fetching data:', error);
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
