/**
 * @description
 * Standardized API Error structure.
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * @description
 * Helper to identify if a response matches our ApiError structure.
 */
export function isApiError(error: any): error is ApiError {
  return error && typeof error.status === 'number' &&
    typeof error.message === 'string';
}
