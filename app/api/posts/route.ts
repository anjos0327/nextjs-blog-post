import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError, AuthenticationError } from '@/lib/utils';
import type { CreatePostRequest, PostQueryParams } from '@/lib/types';

/**
 * GET /api/posts
 * Retrieves posts with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams: PostQueryParams = {
      userId: searchParams.get('userId') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    // Parse filters
    const filters = {
      userId: queryParams.userId ? parseInt(queryParams.userId) : undefined,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 10,
    };

    // Validate pagination parameters
    if (filters.page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (filters.limit < 1 || filters.limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Get posts using service
    const result = await PostService.getAllPosts(filters);

    return NextResponse.json({
      posts: result.posts,
      total: result.total,
      hasMore: result.hasMore,
      page: filters.page,
      limit: filters.limit,
    });

  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

/**
 * POST /api/posts
 * Creates a new post
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    // Parse and validate request body
    const body: CreatePostRequest = await request.json();

    // Create post using service
    const post = await PostService.createPost(user.id, body);

    return NextResponse.json(
      { message: 'Post created successfully', post },
      { status: 201 }
    );

  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
