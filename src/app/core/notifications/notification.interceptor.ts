import {HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {tap} from "rxjs";
import {NotificationService} from "./notification.service";
import {NOTIFICATION_TICKET, NotificationType} from "./notification.models";
import {normalizeApiError} from "@core/http/http-errors";

/**
 * @description
 * Resolves a success message from the HTTP response body or falls back to a default.
 */
const resolveSuccessMessage = (
    event: HttpResponse<unknown>,
    fallbackMessage: string,
): string => {
    const body = event.body as { message?: string } | null | undefined;
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    return message || fallbackMessage;
};

/**
 * @description
 * Intercepts HTTP traffic and triggers user-facing notifications based on tickets.
 */
export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const ticketId = req.context.get(NOTIFICATION_TICKET);

    // if (!ticketId) return next(req);

    return next(req).pipe(
        tap({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    const fallbackMessage = notificationService.getDefaultNotificationMessage(
                        NotificationType.Success,
                    );
                    const message = resolveSuccessMessage(event, fallbackMessage);
                    notificationService.notifySuccess(ticketId, message);
                }
            },
            error: (err: unknown) => {
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
