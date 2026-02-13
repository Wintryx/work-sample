import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { tap } from "rxjs";
import { NotificationService } from "./notification.service";
import { NotificationType } from "./notification.models";
import { FEEDBACK_CONTEXT, NOTIFICATION_TICKET } from "./notification.context";
import { normalizeApiError } from "@core/http/http-errors";

/**
 * @description
 * Intercepts HTTP traffic and triggers user-facing notifications based on tickets or context feedback.
 */
export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const ticketId = req.context.get(NOTIFICATION_TICKET);
  const feedbackConfig = req.context.get(FEEDBACK_CONTEXT);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          // Priority 1: Ticket (Complex/Dynamic)
          if (ticketId) {
            // If a ticket exists, we trust its configuration (message, type) completely.
            // We do NOT resolve the server message here, because it would override
            // the custom message defined in the ticket (e.g. from user input).
            notificationService.notifySuccess(ticketId);
            return;
          }

          // Priority 2: Context Feedback (Simple/Static)
          if (feedbackConfig.message) {
            const type = feedbackConfig.type ?? NotificationType.Success;
            notificationService.notifySuccess(null, feedbackConfig.message, type);
          }
        }
      },
      error: (err: unknown) => {
        // If errors are explicitly suppressed via context, do nothing.
        if (feedbackConfig.suppressErrors) {
          return;
        }

        const message = normalizeApiError(err).message;
        if (ticketId) {
          notificationService.notifyErrorWithTicket(ticketId, message);
          return;
        }
        // No ticket means "use global defaults and show the error".
        notificationService.notifyError(message);
      },
    }),
  );
};
