import {HttpContextToken} from "@angular/common/http";

/**
 * @description
 * Context Token to carry a unique Ticket ID through the HTTP pipeline.
 * This ID links the asynchronous HTTP response back to a prepared notification object.
 */
export const NOTIFICATION_TICKET = new HttpContextToken<string | null>(() => null);

export enum NotificationTypeEnum {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}

export type NotificationType = (typeof NotificationTypeEnum)[keyof typeof NotificationTypeEnum];

/**
 * @description Configuration for individual notification triggers.
 */
export interface NotificationOptions {
  duration?: number;
  /** If true, dismisses all previous toasts before showing this one. */
  clearExisting?: boolean;
  /** Action label, e.g., 'Retry' or 'Close' */
  action?: string;
}

export enum Action {
  System = "SYSTEM",
  User = "USER",
  Refresh = "REFRESH",
}

/**
 * @description Represents a structured message internally.
 */
export interface NotificationObject extends NotificationOptions {
  message: string;
  type: NotificationType;
}
