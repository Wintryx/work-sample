import {HttpContextToken} from "@angular/common/http";
import {NotificationType} from "./notification.models";

/**
 * @description
 * Context Token to carry a unique Ticket ID through the HTTP pipeline.
 * This ID links the asynchronous HTTP response back to a prepared notification object.
 */
export const NOTIFICATION_TICKET = new HttpContextToken<string | null>(() => null);

/**
 * @description
 * Configuration object for the fast-track feedback mechanism.
 * Allows defining a message and type directly on the request context.
 */
export interface FeedbackConfig {
    /** The message to display upon success. Replaces the old `successMessage`. */
    message?: string;
    /** The type of notification to show. Defaults to `NotificationType.Success`. */
    type?: NotificationType;
    /** If true, suppresses the automatic error toast for this request. */
    suppressErrors?: boolean;
}

/**
 * @description
 * Context Token to carry simple feedback configuration directly on the request.
 * This avoids the need to register tickets for standard success messages.
 */
export const FEEDBACK_CONTEXT = new HttpContextToken<FeedbackConfig>(() => ({}));

/**
 * @description
 * Helper to attach feedback configuration to an HTTP request context.
 * Accepts either a simple message string (defaults to Success) or a full config object.
 *
 * @example
 * // Simple success toast
 * context: withFeedback('Item saved')
 *
 * @example
 * // Info toast
 * context: withFeedback({ message: 'Sync started', type: NotificationType.Info })
 *
 * @example
 * // Suppress errors
 * context: withFeedback({ suppressErrors: true })
 */
export function withFeedback(config: FeedbackConfig | string) {
    const finalConfig: FeedbackConfig = typeof config === "string"
        ? {message: config, type: NotificationType.Success}
        : {type: NotificationType.Success, ...config}; // Default type to Success if missing

    return (context: import("@angular/common/http").HttpContext) => {
        context.set(FEEDBACK_CONTEXT, finalConfig);
        return context;
    };
}
