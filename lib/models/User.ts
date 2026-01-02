/**
 * User model - represents a user entity in the system
 * Follows Single Responsibility Principle: only handles user data structure
 */
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

/**
 * User payload for JWT token creation/verification
 * Contains only the essential data needed for authentication
 */
export interface UserPayload {
  id: number;
  name: string;
  username: string;
  email: string;
}

/**
 * User creation input - used for signup/registration
 */
export interface CreateUserInput {
  name: string;
  username: string;
  email: string;
}

/**
 * User login input - used for authentication
 */
export interface LoginUserInput {
  email: string;
}

/**
 * User profile data - used for displaying user information
 */
export interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string;
  postCount?: number;
}
