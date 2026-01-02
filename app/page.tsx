import { PostService } from "@/lib/services";
import type { PostWithAuthor } from "@/lib/models";
import { HomeClient } from "./HomeClient";

async function getRecentPosts(): Promise<PostWithAuthor[]> {
  try {
    return await PostService.getRecentPosts(6);
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return [];
  }
}

export default async function Home() {
  const recentPosts = await getRecentPosts();

  return <HomeClient recentPosts={recentPosts} />;
}
