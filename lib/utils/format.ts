/**
 * Formatting utilities - reusable formatting functions
 * Follows Single Responsibility Principle: only handles formatting logic
 */

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
