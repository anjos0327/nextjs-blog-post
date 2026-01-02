import { NextRequest, NextResponse } from 'next/server';
import { PostService } from '@/lib/services';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError, AuthenticationError, ValidationError } from '@/lib/utils';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * DELETE /api/posts/[id]
 * Soft deletes a post (only by the post author)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      throw new ValidationError('Invalid post ID');
    }

    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      throw new AuthenticationError();
    }

    // Delete post using service
    await PostService.deletePost(postId, user.id);

    return NextResponse.json(
      { message: 'Post deleted successfully' }
    );

  } catch (error) {
    // Handle specific error messages with appropriate status codes
    if (error instanceof Error) {
      if (error.message === 'You can only delete your own posts') {
        return NextResponse.json(
          { error: error.message },
          { status: 403 } // Forbidden
        );
      }
      if (error.message === 'Post not found') {
        return NextResponse.json(
          { error: error.message },
          { status: 404 } // Not Found
        );
      }
      if (error.message === 'Post has already been deleted') {
        return NextResponse.json(
          { error: error.message },
          { status: 410 } // Gone
        );
      }
    }

    // Fallback to generic error handling
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
