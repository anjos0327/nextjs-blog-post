import { prisma } from '@/lib/prisma';
import { ValidationError } from '@/lib/utils';
import type { CreatePostInput, UpdatePostInput, PostFilters, PostWithAuthor } from '@/lib/models';

/**
 * Post Service - Centralizes all post-related business logic
 *
 * This service encapsulates all post operations including:
 * - CRUD operations (Create, Read, Update, Delete)
 * - Business rules validation
 * - Authorization checks
 * - Data transformation
 *
 * SOLID Principles applied:
 * - Single Responsibility: Only handles post-related operations
 * - Open/Closed: New post features can be added without modifying existing methods
 * - Dependency Inversion: Uses abstractions (Prisma types) instead of direct database access
 */
export class PostService {
  /**
   * Get all posts with optional filters and pagination
   */
  static async getAllPosts(filters: PostFilters = {}): Promise<{ posts: PostWithAuthor[]; total: number; hasMore: boolean }> {
    try {
      const { userId, includeDeleted = false, page = 1, limit = 10 } = filters;
      const skip = (page - 1) * limit;

      // Get posts with pagination
      const posts = await prisma.post.findMany({
        where: {
          ...(userId && { userId }),
          ...(includeDeleted ? {} : { deleted: false }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        skip,
        take: limit,
      });

      // Get total count for pagination metadata
      const total = await prisma.post.count({
        where: {
          ...(userId && { userId }),
          ...(includeDeleted ? {} : { deleted: false }),
        },
      });

      const hasMore = skip + posts.length < total;

      return { posts, total, hasMore };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  /**
   * Get a single post by ID
   */
  static async getPostById(id: number): Promise<PostWithAuthor | null> {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  }

  /**
   * Create a new post
   */
  static async createPost(userId: number, postData: CreatePostInput): Promise<PostWithAuthor> {
    try {
      // Validate input
      this.validateCreatePostInput(postData);

      const post = await prisma.post.create({
        data: {
          title: postData.title.trim(),
          body: postData.body.trim(),
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  /**
   * Update an existing post
   */
  static async updatePost(id: number, userId: number, postData: UpdatePostInput): Promise<PostWithAuthor> {
    try {
      // Check if post exists and belongs to user
      const existingPost = await prisma.post.findFirst({
        where: {
          id,
          userId,
          deleted: false,
        },
      });

      if (!existingPost) {
        throw new Error('Post not found or access denied');
      }

      // Validate input
      this.validateUpdatePostInput(postData);

      const updateData: Record<string, unknown> = {};
      if (postData.title !== undefined) {
        updateData.title = postData.title.trim();
      }
      if (postData.body !== undefined) {
        updateData.body = postData.body.trim();
      }

      const post = await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      });

      return post;
    } catch (error) {
      console.error('Error updating post:', error);
      if (error instanceof Error && error.message === 'Post not found or access denied') {
        throw error;
      }
      throw new Error('Failed to update post');
    }
  }

  /**
   * Soft delete a post
   */
  static async deletePost(id: number, userId: number): Promise<void> {
    try {
      // First check if post exists (regardless of ownership)
      const post = await prisma.post.findUnique({
        where: { id },
        select: { id: true, userId: true, deleted: true },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      if (post.deleted) {
        throw new Error('Post has already been deleted');
      }

      // Check if user owns the post
      if (post.userId !== userId) {
        throw new Error('You can only delete your own posts');
      }

      await prisma.post.update({
        where: { id },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      // Re-throw the specific error messages
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete post');
    }
  }

  /**
   * Get posts by user ID
   */
  static async getPostsByUserId(userId: number): Promise<PostWithAuthor[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          userId,
          deleted: false,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      return posts;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw new Error('Failed to fetch user posts');
    }
  }

  /**
   * Get recent posts (for homepage)
   */
  static async getRecentPosts(limit: number = 6): Promise<PostWithAuthor[]> {
    try {
      const posts = await prisma.post.findMany({
        where: {
          deleted: false,
        },
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      });

      return posts;
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      throw new Error('Failed to fetch recent posts');
    }
  }

  /**
   * Validate post creation input
   * Private method following encapsulation principle
   */
  private static validateCreatePostInput(input: CreatePostInput): void {
    if (!input.title?.trim()) {
      throw new ValidationError('Title is required', 'title');
    }

    if (!input.body?.trim()) {
      throw new ValidationError('Body is required', 'body');
    }

    if (input.title.trim().length < 3) {
      throw new ValidationError('Title must be at least 3 characters long', 'title');
    }

    if (input.body.trim().length < 10) {
      throw new ValidationError('Body must be at least 10 characters long', 'body');
    }
  }

  /**
   * Validate post update input
   * Private method following encapsulation principle
   */
  private static validateUpdatePostInput(input: UpdatePostInput): void {
    if (input.title !== undefined && !input.title.trim()) {
      throw new ValidationError('Title cannot be empty', 'title');
    }

    if (input.body !== undefined && !input.body.trim()) {
      throw new ValidationError('Body cannot be empty', 'body');
    }

    if (input.title !== undefined && input.title.trim().length < 3) {
      throw new ValidationError('Title must be at least 3 characters long', 'title');
    }

    if (input.body !== undefined && input.body.trim().length < 10) {
      throw new ValidationError('Body must be at least 10 characters long', 'body');
    }
  }
}
