import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/PostCard";
import { PostFilter } from "@/components/PostFilter";

async function getPosts(userId?: string) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        deleted: false,
        ...(userId ? { userId: parseInt(userId) } : {}),
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

interface PostsPageProps {
  searchParams: Promise<{
    userId?: string;
  }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const resolvedSearchParams = await searchParams;
  const [posts, users] = await Promise.all([
    getPosts(resolvedSearchParams.userId),
    getUsers(),
  ]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Posts
          </h1>
          <PostFilter
            users={users}
            currentUserId={resolvedSearchParams.userId}
          />
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {resolvedSearchParams.userId
                ? "No posts found for this user."
                : "No posts found."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
