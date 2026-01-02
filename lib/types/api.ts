/**
 * API Response types - standardize API responses throughout the application
 * Follows Interface Segregation Principle: specific interfaces for different response types
 */

/**
 * Base API response structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Successful API response
 */
export interface ApiSuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error API response
 */
export interface ApiErrorResponse extends ApiResponse<never> {
  success: false;
  error: string;
  message?: string;
}

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiSuccessResponse<T[]> {
  meta: PaginationMeta;
}

/**
 * Authentication API responses
 */
export interface AuthLoginRequest {
  email: string;
}

export interface AuthSignupRequest {
  name: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}

/**
 * Posts API responses
 */
export interface CreatePostRequest {
  title: string;
  body: string;
}

export interface UpdatePostRequest {
  title?: string;
  body?: string;
}

export interface PostQueryParams {
  userId?: string;
  page?: string;
  limit?: string;
}

/**
 * Users API responses
 */
export interface UserListResponse {
  users: Array<{
    id: number;
    name: string;
    username: string;
  }>;
}

/**
 * Generic error types
 */
export type ApiError =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

export interface ApiErrorDetail {
  code: ApiError;
  message: string;
  field?: string;
}

/**
 * HTTP status codes mapping to error types
 */
export const HTTP_STATUS_MAP = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  500: 'INTERNAL_ERROR',
} as const;
