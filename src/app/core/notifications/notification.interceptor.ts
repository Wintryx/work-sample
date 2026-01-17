import {HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {inject} from "@angular/core";
import {tap} from "rxjs";
import {NotificationService} from "./notification.service";
import {NOTIFICATION_TICKET} from "./notification.models";
import {parseErrorMessage} from "@core/http/http-errors";

export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const ticketId = req.context.get(NOTIFICATION_TICKET);

  if (!ticketId) return next(req);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          notificationService.complete(ticketId);
        }
      },
      error: (err: unknown) => {
        // const message = isApiError(err) ? err.message : "An unexpected error occurred";
        const message = parseErrorMessage(err);
        notificationService.fail(ticketId, message);
      },
    }),
  );
};
