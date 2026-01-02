import { prisma } from '@/lib/prisma';
import { ValidationError, ConflictError } from '@/lib/utils';
import type { User, CreateUserInput, UserProfile } from '@/lib/models';

/**
 * User Service - Centralizes all user-related business logic
 * All database operations related to users should go through this service.
 */
export class UserService {
  /**
   * Find a user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Find a user by ID
   */
  static async findById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new Error('Failed to find user');
    }
  }

  /**
   * Create a new user
   */
  static async create(userData: CreateUserInput): Promise<User> {
    try {
      // Validate input
      this.validateCreateUserInput(userData);

      const user = await prisma.user.create({
        data: {
          name: userData.name.trim(),
          username: userData.username.trim(),
          email: userData.email.toLowerCase().trim(),
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        throw new ConflictError('User with this email or username already exists');
      }
      throw new Error('Failed to create user');
    }
  }

  /**
   * Get all users (for filtering purposes)
   */
  static async getAllUsers(): Promise<Pick<User, 'id' | 'name' | 'username'>[]> {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          username: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get user profile with post count
   */
  static async getUserProfile(id: number): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      });

      if (!user) return null;

      const postCount = await prisma.post.count({
        where: {
          userId: id,
          deleted: false,
        },
      });

      return {
        ...user,
        postCount,
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Validate user creation input
   * Private method following encapsulation principle
   */
  private static validateCreateUserInput(input: CreateUserInput): void {
    if (!input.name?.trim()) {
      throw new ValidationError('Name is required', 'name');
    }

    if (!input.username?.trim()) {
      throw new ValidationError('Username is required', 'username');
    }

    if (!input.email?.trim()) {
      throw new ValidationError('Email is required', 'email');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new ValidationError('Invalid email format', 'email');
    }

    // Username validation (alphanumeric, underscore, dash only)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(input.username)) {
      throw new ValidationError('Username can only contain letters, numbers, underscores, and dashes', 'username');
    }

    // Length validations
    if (input.name.trim().length < 2) {
      throw new ValidationError('Name must be at least 2 characters long', 'name');
    }

    if (input.username.trim().length < 3) {
      throw new ValidationError('Username must be at least 3 characters long', 'username');
    }

  }
}
