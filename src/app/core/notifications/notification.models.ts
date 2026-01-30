import {HttpContextToken} from "@angular/common/http";
import {ValueOf} from "@core/types/value-of";

/**
 * @description
 * Context Token to carry a unique Ticket ID through the HTTP pipeline.
 * This ID links the asynchronous HTTP response back to a prepared notification object.
 */
export const NOTIFICATION_TICKET = new HttpContextToken<string | null>(() => null);

/**
 * @description
 * Context Token to carry simple feedback configuration directly on the request.
 * This avoids the need to register tickets for standard success messages.
 */
export const FEEDBACK_CONTEXT = new HttpContextToken<FeedbackConfig>(() => ({}));

export interface FeedbackConfig {
    successMessage?: string;
    suppressErrors?: boolean;
}

/**
 * @description
 * Helper to attach feedback configuration to an HTTP request context.
 * Accepts either a simple success message string or a full config object.
 */
export function withFeedback(config: FeedbackConfig | string) {
    const finalConfig = typeof config === "string" ? {successMessage: config} : config;
    return (context: import("@angular/common/http").HttpContext) => {
        context.set(FEEDBACK_CONTEXT, finalConfig);
        return context;
    };
}

export const NotificationType = {
    Success: "success",
    Error: "error",
    Info: "info",
    Warning: "warning",
} as const;

export type NotificationType = ValueOf<typeof NotificationType>;

/**
 * @description Configuration for individual notification triggers.
 */
export interface NotificationOptions {
    duration?: number;
    /** If true, dismisses all previous toasts before showing this one. */
    clearExisting?: boolean;
    /** Action label, e.g., 'Retry' or 'Close' */
    actionLabel?: string;
    message: string;
    type: NotificationType;
}
