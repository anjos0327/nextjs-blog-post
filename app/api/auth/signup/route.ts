import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services';
import { handleApiError } from '@/lib/utils';
import type { AuthSignupRequest } from '@/lib/types';

/**
 * POST /api/auth/signup
 * Creates a new user account and starts a session
 */
export async function POST(request: NextRequest) {
  try {
    const body: AuthSignupRequest = await request.json();

    // Create user account using service
    const userPayload = await AuthService.signup(body);

    // Create authentication session
    await AuthService.createAuthSession(userPayload);

    return NextResponse.json(userPayload, { status: 201 });

  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
