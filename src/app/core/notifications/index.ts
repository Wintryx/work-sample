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
export {NOTIFICATION_TICKET} from "./notification.models";
export type {NotificationType, NotificationOptions} from "./notification.models";

/**
 * @internalApi
 * The interceptor is exported only for global registration in app.config.ts.
 */
export * from "./notification.interceptor";
