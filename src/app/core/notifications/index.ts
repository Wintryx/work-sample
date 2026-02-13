/**
 * @module CoreNotifications
 * @description
 * Public API for the global notification system.
 */

/**
 * @publicApi
 * Main service used by domains to dispatch action-based notifications.
 */
export * from "./notification.service";

/**
 * @publicApi
 * Essential models and constants needed to interface with the notification system.
 */
export { NotificationType } from "./notification.models";
export type { NotificationOptions } from "./notification.models";

/**
 * @publicApi
 * HTTP Context tokens and helpers for the notification pipeline.
 */
export { NOTIFICATION_TICKET, withFeedback, FEEDBACK_CONTEXT } from "./notification.context";
export type { FeedbackConfig } from "./notification.context";

/**
 * @internalApi
 * The interceptor is exported only for global registration in app.config.ts.
 */
export * from "./notification.interceptor";
