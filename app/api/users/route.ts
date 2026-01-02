import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services';
import { handleApiError } from '@/lib/utils';

/**
 * GET /api/users
 * Retrieves all users (for filtering purposes)
 */
export async function GET() {
  try {
    // Get all users using service
    const users = await UserService.getAllUsers();

    return NextResponse.json(users);

  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
