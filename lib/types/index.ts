/**
 * Central export file for all API types
 * Provides a single entry point for importing types throughout the application
 */

// API response types
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginatedApiResponse,
  PaginationMeta,
  ApiError,
  ApiErrorDetail,
} from './api';

// Authentication API types
export type {
  AuthLoginRequest,
  AuthSignupRequest,
  AuthResponse,
} from './api';

// Posts API types
export type {
  CreatePostRequest,
  UpdatePostRequest,
  PostQueryParams,
} from './api';

// Users API types
export type {
  UserListResponse,
} from './api';

// Constants
export { HTTP_STATUS_MAP } from './api';
