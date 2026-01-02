import { User } from './User';

/**
 * Post model - represents a blog post entity
 * Follows Single Responsibility Principle: only handles post data structure
 */
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  deleted: boolean;
  deletedAt?: Date | null;
  user: User;
}

/**
 * Post creation input - used for creating new posts
 */
export interface CreatePostInput {
  title: string;
  body: string;
}

/**
 * Post update input - used for updating existing posts
 */
export interface UpdatePostInput {
  title?: string;
  body?: string;
}

/**
 * Post with author information - for display purposes
 */
export interface PostWithAuthor extends Omit<Post, 'user'> {
  user: Pick<User, 'id' | 'name' | 'username'>;
}

/**
 * Post filter options - used for querying posts
 */
export interface PostFilters {
  userId?: number;
  includeDeleted?: boolean;
}

/**
 * Post list response - includes pagination metadata
 */
export interface PostListResponse {
  posts: PostWithAuthor[];
  total: number;
  hasMore: boolean;
}
