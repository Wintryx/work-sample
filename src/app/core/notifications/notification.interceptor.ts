import {HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {tap} from "rxjs";
import {NotificationService} from "./notification.service";
import {NOTIFICATION_TICKET} from "./notification.models";
import {normalizeApiError} from "@core/http/http-errors";

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const ticketId = req.context.get(NOTIFICATION_TICKET);

    // if (!ticketId) return next(req);

    return next(req).pipe(
        tap({
            next: (event) => {
                if (event instanceof HttpResponse) {
                    notificationService.notifySuccess(ticketId, "Action completed successfully.");
                }
            },
            error: (err: unknown) => {
                const message = normalizeApiError(err).message;
                if (ticketId) {
                    notificationService.notifyError(ticketId, message);
                    return;
                }
                const fallbackTicket = notificationService.registerTicket({
                    ...notificationService.defaultErrorNotificationObject,
                    message: message,
                });
                notificationService.notifyError(fallbackTicket, message);
            },
        }),
    );
};
