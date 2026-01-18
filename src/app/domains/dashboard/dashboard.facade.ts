/**
 * @module DashboardDomain
 * @description
 * Facade for the Dashboard domain.
 *
 * This facade serves as the single source of truth for the dashboard UI, encapsulating
 * complex state management and asynchronous data fetching. It leverages Angular Signals
 * for high-performance, fine-grained reactivity and follows the "State-Stream" pattern.
 *
 * Key Responsibilities:
 * - Abstracts the HttpClient away from the UI components.
 * - Manages the internal DashboardState (items, loading status, errors).
 * - Exposes read-only computed signals to ensure unidirectional data flow.
 */

import {computed, DestroyRef, inject, Injectable, signal} from "@angular/core";
import {DashboardItemDto} from "./dashboard.models";
import {finalize} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NotificationTypeEnum} from "@core/notifications/notification.models";
import {NotificationService} from "@core/notifications/notification.service";
import {parseErrorMessage} from "@core/http/http-errors";
import {DASHBOARD_API} from "./data-access/dashboard.providers";

/**
 * @description Internal state for the Dashboard.
 */
interface DashboardState {
  items: DashboardItemDto[];
  loading: boolean;
  error: string | null;
}

@Injectable({providedIn: "root"})
export class DashboardFacade {
  private readonly api = inject(DASHBOARD_API);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  private readonly _state = signal<DashboardState>({
    items: [],
    loading: false,
    error: null,
  });

  // Public Signals for the UI (Computed to ensure read-only access)
  readonly items = computed(() => {
    const state = this._state();

    // Tip: Self-healing state.
    // If someone accesses items but they are empty and we aren't already loading, trigger a load.
    if (state.items.length === 0 && !state.loading && !state.error) {
      // We use untracked or a setTimeout to avoid "computed side-effects" warnings
      setTimeout(() => this.loadItems());
    }

    return state.items;
  });

  readonly isLoading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly hasItems = computed(() => this._state().items.length > 0);

  /**
   * @description Fetches items from the dashboard API.
   */
  loadItems(ticketId: string | null = null): void {
    this._state.update((s) => ({...s, loading: true, error: null}));

    this.api
      .loadItems(ticketId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this._state.update((s) => ({...s, loading: false}));
        }),
      )
      .subscribe({
        next: (items) => {
          this._state.update((s) => ({...s, items}));
        },
        error: (err: unknown) => {
          const message = parseErrorMessage(err, "Failed to load dashboard data");
          this._state.update((s) => ({...s, error: message}));
        },
      });
  }

  /**
   * @description Example of a domain-specific action.
   */
  refresh(): void {
    const ticket = this.notificationService.register({
      message: "Dashboard data updated.",
      type: NotificationTypeEnum.Success,
      clearExisting: true,
    });
    this.loadItems(ticket);
  }

  /**
   * @description
   * Debug method to simulate a failing API request.
   * Demonstrates automated error toast via notificationInterceptor.
   */
  triggerError(): void {
    const request$ = this.api.triggerError?.("DEBUG_ERROR");
    if (!request$) return;
    request$.subscribe({
      error: (err) => console.log("Facade received error:", err)
    });

  }
}
