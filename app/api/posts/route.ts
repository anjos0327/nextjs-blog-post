import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError, AuthenticationError } from '@/lib/utils';
import type { CreatePostRequest, PostQueryParams } from '@/lib/types';

/**
 * GET /api/posts
 * Retrieves posts with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams: PostQueryParams = {
      userId: searchParams.get('userId') || undefined,
    };

    // Parse filters
    const filters = {
      userId: queryParams.userId ? parseInt(queryParams.userId) : undefined,
    };

    // Get posts using service
    const posts = await PostService.getAllPosts(filters);

    return NextResponse.json(posts);

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
