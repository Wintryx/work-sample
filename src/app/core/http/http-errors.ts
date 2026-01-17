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
export function isApiError(error: unknown): error is ApiError {
  /**
   * Tip: We check if the error is an object and not null first,
   * then we safely verify the existence and type of its properties.
   */
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as Record<string, unknown>)["status"] === "number" &&
    "message" in error &&
    typeof (error as Record<string, unknown>)["message"] === "string"
  );
}

/**
 * @description
 * Extracts a human-readable error message from various error types.
 * Centralizes error parsing logic to keep facades and interceptors clean.
 */
export function parseErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred",
): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
