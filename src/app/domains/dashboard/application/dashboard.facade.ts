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
import {Observable, catchError, finalize, of, shareReplay, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {API_BASE_URL} from "@core/http/api.tokens";
import {NOTIFICATION_TICKET, NotificationTypeEnum} from "@core/notifications/notification.models";
import {NotificationService} from "@core/notifications/notification.service";
import {parseErrorMessage} from "@core/http/http-errors";
import {createLoadableState, LoadableState} from "@core/state/loadable";

/**
 * @description Internal state for the Dashboard.
 */
type DashboardState = LoadableState<DashboardItemDto[]>;

@Injectable({providedIn: "root"})
export class DashboardFacade {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly notificationService = inject(NotificationService);
  /**
   * @description
   * Caches the current in-flight request to prevent duplicate HTTP calls
   * when multiple consumers load data at the same time.
   */
  private inFlightItems$: Observable<DashboardItemDto[]> | null = null;

  private readonly _state = signal<DashboardState>(createLoadableState<DashboardItemDto[]>([]));

  // Public Signals for the UI (Computed to ensure read-only access)
  readonly items = computed(() => this._state().data);

  readonly isLoading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
  readonly hasItems = computed(() => this._state().data.length > 0);

  /**
   * @description
   * Ensures data is loaded once, returning the current list for SSR-safe resolvers.
   */
  ensureLoaded(): Observable<DashboardItemDto[]> {
    return this.fetchItems$(null);
  }

  /**
   * @description Fetches items from the mock backend.
   */
  loadItems(ticketId: string | null = null): void {
    this.fetchItems$(ticketId, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  /**
   * @description
   * Shared data-loading pipeline for initial loads and forced refreshes.
   * Reuses in-flight requests to avoid parallel loads and keeps SSR resolvers consistent.
   */
  private fetchItems$(ticketId: string | null, force = false): Observable<DashboardItemDto[]> {
    const state = this._state();
    if (state.loading) return this.inFlightItems$ ?? of(state.data);
    if (!force && state.loaded) return of(state.data);

    this._state.update((s) => ({...s, loading: true, error: null}));
    const url = `${this.baseUrl}/dashboard/items`;
    const context = ticketId ? new HttpContext().set(NOTIFICATION_TICKET, ticketId) : undefined;

    const request$ = this.http.get<DashboardItemDto[]>(url, {context}).pipe(
      tap((items) => {
        this._state.update((s) => ({...s, data: items, loaded: true}));
      }),
      catchError((err: unknown) => {
        const message = parseErrorMessage(err, "Failed to load dashboard data");
        this._state.update((s) => ({...s, error: message}));
        return of([]);
      }),
      finalize(() => {
        this._state.update((s) => ({...s, loading: false}));
        this.inFlightItems$ = null;
      }),
      /**
       * @description
       * Shares the latest response with all subscribers and prevents duplicate
       * HTTP requests during concurrent loads.
       */
      shareReplay({bufferSize: 1, refCount: true}),
    );

    this.inFlightItems$ = request$;
    return request$;
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
