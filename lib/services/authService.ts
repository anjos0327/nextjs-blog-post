import { createToken, verifyToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';
import { UserService } from './userService';
import { ValidationError } from '@/lib/utils';
import type { UserPayload, LoginUserInput, CreateUserInput } from '@/lib/models';

/**
 * Authentication Service - Manages user authentication and session handling
 *
 * This service provides a clean interface for:
 * - User login/logout operations
 * - JWT token management
 * - Session creation and validation
 * - User registration with validation
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles authentication concerns
 * - Interface Segregation: Clean, focused methods for different auth operations
 * - Dependency Inversion: Depends on other services through their interfaces
 */
export class AuthService {
  /**
   * Login user with email
   */
  static async login(loginData: LoginUserInput): Promise<UserPayload> {
    try {
      // Validate input
      this.validateLoginInput(loginData);

      // Find user by email
      const user = await UserService.findByEmail(loginData.email);
      if (!user) {
        throw new ValidationError('Invalid email', 'email');
      }

      // Create and return token payload
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error('Error during login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login failed');
    }
  }

  /**
   * Register a new user
   */
  static async signup(userData: CreateUserInput): Promise<UserPayload> {
    try {
      // Validate input
      this.validateSignupInput(userData);

      // Create user
      const user = await UserService.create(userData);

      // Return token payload
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error('Error during signup:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Signup failed');
    }
  }

  /**
   * Get current user from token
   */
  static async getCurrentUser(token: string): Promise<UserPayload | null> {
    try {
      return verifyToken(token);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  /**
   * Create authentication token and set cookie
   */
  static async createAuthSession(user: UserPayload): Promise<string> {
    try {
      const token = createToken(user);
      await setAuthCookie(token);
      return token;
    } catch (error) {
      console.error('Error creating auth session:', error);
      throw new Error('Failed to create authentication session');
    }
  }

  /**
   * Clear authentication session
   */
  static async clearAuthSession(): Promise<void> {
    try {
      await clearAuthCookie();
    } catch (error) {
      console.error('Error clearing auth session:', error);
      throw new Error('Failed to clear authentication session');
    }
  }

  /**
   * Refresh user token (extend expiration)
   */
  static async refreshToken(user: UserPayload): Promise<string> {
    try {
      const token = createToken(user);
      await setAuthCookie(token);
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh token');
    }
  }

  /**
   * Validate login input
   * Private method following encapsulation principle
   */
  private static validateLoginInput(input: LoginUserInput): void {
    if (!input.email?.trim()) {
      throw new ValidationError('Email is required', 'email');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }

  /**
   * Validate signup input
   * Private method following encapsulation principle
   */
  private static validateSignupInput(input: CreateUserInput): void {
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
