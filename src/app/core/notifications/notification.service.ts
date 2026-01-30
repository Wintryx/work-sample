import {inject, Injectable, signal} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import defaults from "lodash-es/defaults";
import omit from "lodash-es/omit";
import {NotificationOptions, NotificationType,} from "./notification.models";
import {ToastComponent} from "./ui/toast.component";

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
    private readonly defaultNotificationMessages: Record<NotificationType, string> = {
        [NotificationType.Success]: "Action completed successfully.",
        [NotificationType.Info]: "Here is an informational update.",
        [NotificationType.Warning]: "Warning: Please double-check the result.",
        [NotificationType.Error]: "An error occurred.",
    };
    private readonly snackBar = inject(MatSnackBar);
    private readonly _registry = signal<Map<string, NotificationOptions>>(new Map());

    /**
     * @description
     * Registers a planned notification and returns a unique Ticket ID.
     * Use this for success toasts or special error variants that require
     * per-request customization.
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
     *
     * @param ticketId - The ticket ID to resolve (optional).
     * @param message - The message to display (overrides ticket or used as standalone).
     * @param type - The notification type (defaults to Success).
     */
    notifySuccess(
        ticketId?: string | null,
        message?: string,
        type: NotificationType = NotificationType.Success
    ): void {
        let obj: NotificationOptions = {
            message: message ?? "",
            type: type,
            actionLabel: "OK",
            clearExisting: true,
            duration: 4000
        };

        if (ticketId) {
            if (this._registry().get(ticketId) !== undefined) {
                obj = this._registry().get(ticketId)!;
                // If a message override was passed, apply it
                if (message) {
                    obj = {...obj, message};
                }
                this.notify(obj);
                this.clear(ticketId);
            }
        } else {
            // If no ticket, but we have a message (e.g. from withFeedback), show it.
            if (message) {
                this.notify({...obj, message});
            } else if (this.displayAlwaysSuccessNotification()) {
                this.notify(obj);
            }
        }
    }

    /**
     * @description
     * Discards the success message and shows the error instead.
     * Error toasts are always displayed using the global defaults plus overrides.
     */
    notifyError(message: string, overrides: Partial<NotificationOptions> = {}): void {
        const notificationObject = this.buildErrorHttpNotification(message, overrides);
        this.notify(notificationObject);
    }

    /**
     * @description
     * Shows an error using a pre-registered ticket (special case).
     * Falls back to defaults when the ticket is missing.
     */
    notifyErrorWithTicket(
        ticketId: string,
        message: string,
        overrides: Partial<NotificationOptions> = {},
    ): void {
        const plannedNotification = this._registry().get(ticketId);
        if (plannedNotification) {
            this.clear(ticketId);
        }
        const mergedOverrides = plannedNotification
            ? {...plannedNotification, ...overrides}
            : {...overrides};
        const overrideMessage = mergedOverrides.message;
        const resolvedMessage = overrideMessage ?? message;
        const notificationObject = this.buildErrorHttpNotification(
            resolvedMessage,
            omit(mergedOverrides, "message"),
        );
        this.notify(notificationObject);
    }

    /**
     * @description
     * Returns the default message for a given notification type.
     */
    getDefaultNotificationMessage(type: NotificationType): string {
        return this.defaultNotificationMessages[type];
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
     * Shows a rich snackbar using the custom ToastComponent.
     * We apply the type-specific class to the panel so Material overrides can color the container.
     */
    private notify(options: NotificationOptions): void {
        if (options.clearExisting) this.snackBar.dismiss();

        this.snackBar.openFromComponent(ToastComponent, {
            data: options,
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
    private buildErrorHttpNotification(
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
