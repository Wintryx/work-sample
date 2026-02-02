import {ValueOf} from "@core/types/value-of";

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
