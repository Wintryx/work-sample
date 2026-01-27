import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpContext} from "@angular/common/http";
import {API_BASE_URL} from "@core/http/api.tokens";
import {AuthErrorCode, AuthFacade} from "@core/auth";
import {normalizeApiError} from "@core/http/http-errors";
import {NotificationService} from "@core/notifications/notification.service";
import {NOTIFICATION_TICKET} from "@core/notifications/notification.models";

/**
 * @description
 * Facade for notification-related debug actions.
 * Keeps UI components free from HTTP and auth side-effects.
 */
@Injectable({providedIn: "root"})
export class NotificationsFacade {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(API_BASE_URL);
    private readonly authFacade = inject(AuthFacade);
    private readonly notificationService = inject(NotificationService);

    /**
     * @description
     * Triggers a simulated API error to exercise the notification interceptor.
     * When a custom message is provided, a ticket is registered to override the error toast.
     */
    simulateError(customMessage?: string | null): void {
        const ticketId = this.createErrorTicket(customMessage);
        const url = `${this.baseUrl}/debug/error`;
        const context = ticketId ? new HttpContext().set(NOTIFICATION_TICKET, ticketId) : undefined;

        this.http.get(url, {context}).subscribe({
            error: this.handleSimulatedError,
        });
    }

    /**
     * @description
     * Triggers a simulated unauthorized response and enforces logout.
     * When a custom message is provided, a ticket is registered to override the error toast.
     */
    simulateUnauthorized(customMessage?: string | null): void {
        const ticketId = this.createErrorTicket(customMessage);
        const url = `${this.baseUrl}/debug/unauthorized`;
        const context = ticketId ? new HttpContext().set(NOTIFICATION_TICKET, ticketId) : undefined;
        this.http.get(url, {context}).subscribe({
            error: this.handleUnauthorizedError,
        });
    }

    /**
     * @description
     * Silently consumes simulated errors to avoid console noise.
     */
    private readonly handleSimulatedError = (): void => { /* empty */
    };

    /**
     * @description
     * Normalizes unauthorized errors and triggers a logout when needed.
     */
    private readonly handleUnauthorizedError = (err: unknown): void => {
        const normalized = normalizeApiError<AuthErrorCode>(err);
        if (normalized.code === AuthErrorCode.Unauthorized || normalized.status === 401) {
            this.authFacade.logout();
        }
    };

    /**
     * @description
     * Registers a ticket for a custom error message when provided.
     */
    private createErrorTicket(customMessage?: string | null): string | null {
        const message = customMessage?.trim();
        if (!message) {
            return null;
        }

        return this.notificationService.registerTicket({
            ...this.notificationService.defaultErrorNotificationObject,
            message,
        });
    }
}
