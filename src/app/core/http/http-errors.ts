import {HttpErrorResponse} from "@angular/common/http";

/**
 * @description
 * Standardized API Error structure.
 */
export interface ApiError<TCode extends string = string> {
    status: number;
    message: string;
    code?: TCode;
    errors?: Record<string, string[]>;
}

/**
 * @description
 * Helper to identify if a response matches our ApiError structure.
 */
export function isApiError<TCode extends string = string>(error: unknown): error is ApiError<TCode> {
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
 * Extracts a typed ApiError from either HttpErrorResponse payloads or direct objects.
 */
export function extractApiError<TCode extends string = string>(error: unknown): ApiError<TCode> | null {
    if (error instanceof HttpErrorResponse) {
        return isApiError<TCode>(error.error) ? error.error : null;
    }

    return isApiError<TCode>(error) ? error : null;
}

/**
 * @description
 * Type guard that narrows an unknown error to a specific ApiError code.
 */
export function hasApiErrorCode<TCode extends string>(error: unknown, code: TCode): error is ApiError<TCode> {
    const apiError = extractApiError<TCode>(error);
    return apiError?.code === code;
}

/**
 * @description
 * Robust error parser.
 * Order of checks is critical: We prioritize the response body (payload)
 * over the technical wrapper properties.
 */
export function parseErrorMessage(error: unknown, fallback = "An unexpected error occurred"): string {
    // 1. Priority: Handle Angular HttpErrorResponse explicitly
    // We don't use isApiError here first because HttpErrorResponse would satisfy it
    // but return the technical 'message' instead of the backend's body.
    if (error instanceof HttpErrorResponse) {
        const body = error.error;

        // Check if the mock/backend sent a message in the body
        if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
            return body.message;
        }

        // Fallback to status text (e.g. "Internal Server Error")
        if (error.statusText && error.statusText !== "OK") {
            return error.statusText;
        }
    }

    // 2. Second Priority: Our custom ApiError interface
    if (isApiError(error)) {
        return error.message;
    }

    // 3. Standard JS Errors
    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
