'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form state and operations
 * Follows Single Responsibility Principle: only handles form-related state and effects
 */
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormActions<T> {
  setValue: (field: keyof T, value: unknown) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  reset: (initialData?: Partial<T>) => void;
  submit: (onSubmit: (data: T) => Promise<void> | void) => Promise<void>;
}

export function useForm<T extends Record<string, unknown>>(
  initialData: T,
  validate?: (data: T) => Record<string, string>
): FormState<T> & FormActions<T> {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Set value for a specific field
   */
  const setValue = useCallback((field: keyof T, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Set error for a specific field
   */
  const setError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Reset form to initial state
   */
  const reset = useCallback((newInitialData?: Partial<T>) => {
    setData({ ...initialData, ...newInitialData });
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  /**
   * Submit form with validation
   */
  const submit = useCallback(async (onSubmit: (data: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      // Run validation if provided
      if (validate) {
        const validationErrors = validate(data);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
        }
      }

      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  }, [data, validate, clearErrors]);

  /**
   * Check if form is valid (no errors)
   */
  const isValid = Object.keys(errors).length === 0;

  return {
    data,
    errors,
    isSubmitting,
    isValid,
    setValue,
    setError,
    clearError,
    clearErrors,
    reset,
    submit,
  };
}
