import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services';
import { handleApiError } from '@/lib/utils';
import type { AuthLoginRequest } from '@/lib/types';

/**
 * POST /api/auth/login
 * Authenticates a user and creates a session
 */
export async function POST(request: NextRequest) {
  try {
    const body: AuthLoginRequest = await request.json();

    // Authenticate user using service
    const userPayload = await AuthService.login(body);

    // Create authentication session
    await AuthService.createAuthSession(userPayload);

    return NextResponse.json(userPayload);

  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
