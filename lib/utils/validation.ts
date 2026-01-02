/**
 * Validation utilities - reusable validation functions
 * Follows Single Responsibility Principle: only handles validation logic
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Username validation (alphanumeric, underscore, dash only)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username.trim());
}

/**
 * Required field validation
 */
export function isRequired(value: string | undefined | null): boolean {
  return Boolean(value?.trim());
}

/**
 * Minimum length validation
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Maximum length validation
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Validate user input comprehensively
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUserInput(input: {
  name?: string;
  username?: string;
  email?: string;
}): ValidationResult {
  const errors: string[] = [];

  // Name validation
  if (input.name !== undefined) {
    if (!isRequired(input.name)) {
      errors.push('Name is required');
    } else if (!hasMinLength(input.name, 2)) {
      errors.push('Name must be at least 2 characters long');
    }
  }

  // Username validation
  if (input.username !== undefined) {
    if (!isRequired(input.username)) {
      errors.push('Username is required');
    } else if (!hasMinLength(input.username, 3)) {
      errors.push('Username must be at least 3 characters long');
    } else if (!isValidUsername(input.username)) {
      errors.push('Username can only contain letters, numbers, underscores, and dashes');
    }
  }

  // Email validation
  if (input.email !== undefined) {
    if (!isRequired(input.email)) {
      errors.push('Email is required');
    } else if (!isValidEmail(input.email)) {
      errors.push('Invalid email format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate post input comprehensively
 */
export function validatePostInput(input: {
  title?: string;
  body?: string;
}): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (input.title !== undefined) {
    if (!isRequired(input.title)) {
      errors.push('Title is required');
    } else if (!hasMinLength(input.title, 3)) {
      errors.push('Title must be at least 3 characters long');
    }
  }

  // Body validation
  if (input.body !== undefined) {
    if (!isRequired(input.body)) {
      errors.push('Content is required');
    } else if (!hasMinLength(input.body, 10)) {
      errors.push('Content must be at least 10 characters long');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
