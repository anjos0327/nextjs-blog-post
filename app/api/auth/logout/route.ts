import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
  // Limpiar la cookie de autenticación
  await clearAuthCookie();

  return NextResponse.json({ message: 'Logged out successfully' });
}
