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
import {HttpClient, HttpContext} from "@angular/common/http";
import {DashboardItemDto} from "@domains/dashboard/domain/dashboard.models";
import {Observable, catchError, finalize, of, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {API_BASE_URL} from "@core/http/api.tokens";
import {NOTIFICATION_TICKET, NotificationTypeEnum} from "@core/notifications/notification.models";
import {NotificationService} from "@core/notifications/notification.service";
import {parseErrorMessage} from "@core/http/http-errors";

/**
 * @description Internal state for the Dashboard.
 */
interface DashboardState {
  items: DashboardItemDto[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

@Injectable({providedIn: "root"})
export class DashboardFacade {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly notificationService = inject(NotificationService);

  private readonly _state = signal<DashboardState>({
    items: [],
    loading: false,
    loaded: false,
    error: null,
  });

  // Public Signals for the UI (Computed to ensure read-only access)
  readonly items = computed(() => this._state().items);

  readonly isLoading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly hasItems = computed(() => this._state().items.length > 0);

  /**
   * @description
   * Ensures data is loaded once, returning the current list for SSR-safe resolvers.
   */
  ensureLoaded(): Observable<DashboardItemDto[]> {
    const state = this._state();
    if (state.loaded || state.loading) return of(state.items);

    this._state.update((s) => ({...s, loading: true, error: null}));
    const url = `${this.baseUrl}/dashboard/items`;

    return this.http.get<DashboardItemDto[]>(url).pipe(
      tap((items) => {
        this._state.update((s) => ({...s, items, loaded: true}));
      }),
      catchError((err: unknown) => {
        const message = parseErrorMessage(err, "Failed to load dashboard data");
        this._state.update((s) => ({...s, error: message}));
        return of([]);
      }),
      finalize(() => {
        this._state.update((s) => ({...s, loading: false}));
      }),
    );
  }

  /**
   * @description Fetches items from the mock backend.
   */
  loadItems(ticketId: string | null = null): void {
    this._state.update((s) => ({...s, loading: true, error: null}));

    const url = `${this.baseUrl}/dashboard/items`;

    const context = new HttpContext().set(NOTIFICATION_TICKET, ticketId);

    this.http
      .get<DashboardItemDto[]>(url, {context})
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this._state.update((s) => ({...s, loading: false}));
        }),
      )
      .subscribe({
        next: (items) => {
          this._state.update((s) => ({...s, items, loaded: true}));
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
    // We don't even need a ticket here, because our interceptor
    // catches ALL HttpErrors if we want, or we use a System ticket.
    const url = `${this.baseUrl}/debug/error`;
    this._state.update((s) => ({...s, loading: true, error: null}));

    this.http
      .get(url, {
        context: new HttpContext().set(NOTIFICATION_TICKET, "DEBUG_ERROR"),
      })
      .pipe(finalize(() => this._state.update((s) => ({...s, loading: false}))))
      .subscribe({
        error: (err) => {
          const message = parseErrorMessage(err, "Simulated error");
          this._state.update((s) => ({...s, error: message}));
        },
      });
  }
}
