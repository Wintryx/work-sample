import { inject, Injectable, signal } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  NotificationObject,
  NotificationOptions,
  NotificationType,
  NotificationTypeEnum,
} from "./notification.models";

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  // private readonly injector = inject(Injector);

  private readonly _registry = signal<Map<string, NotificationObject>>(new Map());

  /**
   * @description
   * Registers a planned notification and returns a unique Ticket ID.
   */
  register(obj: NotificationObject): string {
    const ticketId = crypto.randomUUID();

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
   */
  complete(ticketId: string): void {
    const obj = this._registry().get(ticketId);
    if (obj) {
      this.notify(obj.message, obj.type, obj);
      this.clear(ticketId);
    }
  }

  /**
   * @description
   * Discards the success message and shows the error instead.
   */
  fail(ticketId: string | null, errorMessage: string): void {
    this.notify(errorMessage, NotificationTypeEnum.Error, { clearExisting: true });
    if (ticketId) this.clear(ticketId);
  }

  private clear(ticketId: string): void {
    this._registry.update((map) => {
      const newMap = new Map(map);
      newMap.delete(ticketId);
      return newMap;
    });
  }

  private notify(message: string, type: NotificationType, options: NotificationOptions = {}): void {
    if (options.clearExisting) this.snackBar.dismiss();

    this.snackBar.open(message, options.action ?? "OK", {
      duration: options.duration ?? 4000,
      horizontalPosition: "end",
      verticalPosition: "bottom",
      panelClass: [`notification-${type}`],
    });
  }
}
