import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name, username } = await request.json();

    // Validar que todos los campos requeridos estén presentes
    if (!email || !name || !username) {
      return NextResponse.json(
        { error: 'Email, name, and username are required' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        );
      }
    }

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      }
    });

    // Crear token JWT y establecer cookie para sesión persistente
    const token = createToken(user);
    await setAuthCookie(token);

    return NextResponse.json(user, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
