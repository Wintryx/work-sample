import {HttpContextToken} from "@angular/common/http";
import {ValueOf} from "@core/types/value-of";

/**
 * @description
 * Context Token to carry a unique Ticket ID through the HTTP pipeline.
 * This ID links the asynchronous HTTP response back to a prepared notification object.
 */
export const NOTIFICATION_TICKET = new HttpContextToken<string | null>(() => null);

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
}

/**
 * @description Represents a structured message internally.
 */
export interface NotificationObject extends NotificationOptions {
    message: string;
    type: NotificationType;
}
