import {inject, Injectable, signal} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import defaults from "lodash/defaults";
import {NotificationOptions, NotificationType,} from "./notification.models";

@Injectable({providedIn: "root"})
export class NotificationService {
    displayAlwaysSuccessNotification = signal(false);
    public defaultErrorNotificationObject: NotificationOptions = {
        message: "An error occurred.",
        type: NotificationType.Error,
        actionLabel: "OK",
        clearExisting: true,
        duration: 4000
    };
    private readonly snackBar = inject(MatSnackBar);
    private readonly _registry = signal<Map<string, NotificationOptions>>(new Map());

    /**
     * @description
     * Registers a planned notification and returns a unique Ticket ID.
     * Use this when you want to control the exact toast that will be shown
     * for a later async response (e.g. success or specific error variants).
     */
    registerTicket(obj: NotificationOptions): string {
        /**
         * @description
         * Falls back to a deterministic ID when `crypto.randomUUID` is unavailable
         * (e.g., on non-secure HTTP contexts during mobile testing).
         */
        const ticketId =
            crypto?.randomUUID?.() ??
            `ticket_${Date.now()}_${Math.random().toString(16).slice(2)}`;

        this._registry.update((map) => {
            const newMap = new Map(map);
            newMap.set(ticketId, obj);
            return newMap;
        });

        return ticketId;
    }

    /**
     * @description
     * Plays the successful notification for a ticket and cleans up.
     * Success toasts are only shown when a matching ticket is registered,
     * unless `displayAlwaysSuccessNotification` is enabled.
     */
    notifySuccess(ticketId?: string | null, message?: string): void {
        let obj: NotificationOptions = {
            message: message ?? "",
            type: NotificationType.Success,
            actionLabel: "OK",
            clearExisting: true,
            duration: 4000
        };
        if (ticketId) {
            if (this._registry().get(ticketId) !== undefined) {
                obj = this._registry().get(ticketId)!;
                this.notify(obj);
                this.clear(ticketId);
            }
        } else {
            if (message && this.displayAlwaysSuccessNotification()) {
                this.notify(obj);
            }
        }
    }

    /**
     * @description
     * Discards the success message and shows the error instead.
     * Error toasts are always displayed. When a ticket exists, it is used to
     * override defaults; otherwise the default error configuration is applied.
     */
    notifyError(ticketId: string | null, message: string): void {
        let notificationObject = this.buildErrorNotification(message);
        if (ticketId) {
            const plannedNotification = this._registry().get(ticketId);
            if (plannedNotification) {
                notificationObject = this.buildErrorNotification(message, plannedNotification);
                this.clear(ticketId);
            }
        }
        this.notify(notificationObject);
    }

    /**
     * @description
     * Removes a ticket from the registry to prevent stale notifications.
     */
    private clear(ticketId: string): void {
        this._registry.update((map) => {
            const newMap = new Map(map);
            newMap.delete(ticketId);
            return newMap;
        });
    }

    /**
     * @description
     * Shows a snackbar with the resolved notification options.
     */
    private notify(options: NotificationOptions): void {
        if (options.clearExisting) this.snackBar.dismiss();

        this.snackBar.open(options.message, options.actionLabel ?? "OK", {
            duration: options.duration ?? 4000,
            horizontalPosition: "end",
            verticalPosition: "bottom",
            panelClass: [`notification-${options.type}`],
        });
    }

    /**
     * @description
     * Combines defaults with optional overrides. Uses lodash `defaults` to
     * ensure any undefined fields fall back to the global error configuration.
     */
    private buildErrorNotification(
        message?: string | null,
        overrides: Partial<NotificationOptions> = {},
    ): NotificationOptions {
        const base = {
            ...overrides,
            message: overrides.message ?? message,
        };
        return defaults(base, this.defaultErrorNotificationObject) as NotificationOptions;
    }
}
