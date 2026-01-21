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

import {computed, DestroyRef, inject, Injectable} from "@angular/core";
import {HttpClient, HttpContext, HttpParams} from "@angular/common/http";
import {DashboardItem, DashboardItemDto} from "@domains/dashboard/domain/dashboard.models";
import {catchError, finalize, map, Observable, of, shareReplay, tap} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {API_BASE_URL} from "@core/http/api.tokens";
import {NOTIFICATION_TICKET, NotificationType} from "@core/notifications/notification.models";
import {NotificationService} from "@core/notifications/notification.service";
import {extractApiError, hasApiErrorCode, parseErrorMessage} from "@core/http/http-errors";
import {createLoadableSignal, createLoadableState} from "@core/state/loadable-state";
import {toDashboardItems} from "./dashboard.mappers";
import {DashboardErrorCode} from "@domains/dashboard/domain/dashboard.error-codes";
import {AuthFacade} from "@core/auth";

@Injectable({providedIn: "root"})
export class DashboardFacade {
    private readonly http = inject(HttpClient);
    private readonly destroyRef = inject(DestroyRef);
    private readonly baseUrl = inject(API_BASE_URL);
    private readonly notificationService = inject(NotificationService);
    private readonly authFacade = inject(AuthFacade);
    /**
     * @description
     * Caches the current in-flight request to prevent duplicate HTTP calls
     * when multiple consumers load data at the same time.
     */
    private inFlightItems$: Observable<DashboardItem[]> | null = null;

    private readonly _state = createLoadableSignal<DashboardItem[]>([]);

    // Public Signals for the UI (Computed to ensure read-only access)
    readonly items = computed(() => this._state().data);

    readonly isLoading = computed(() => this._state().loading);
    readonly error = computed(() => this._state().error);
    readonly hasItems = computed(() => this._state().data.length > 0);

    /**
     * @description
     * Ensures data is loaded once, returning the current list for SSR-safe resolvers.
     */
    ensureLoaded(): Observable<DashboardItem[]> {
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
     * @description Example of a domain-specific action.
     */
    refresh(): void {
        const ticket = this.notificationService.register({
            message: "Dashboard data updated.",
            type: NotificationType.Success,
            clearExisting: true,
        });
        this.loadItems(ticket);
    }

    /**
     * @description
     * Debug a method to simulate a failing API request.
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

    /**
     * @description
     * Debug helper that simulates an unauthorized response and exercises the typed error-code path.
     */
    triggerUnauthorized(): void {
        // this.notificationService.fail(
        //     null,
        //     "You are not authenticated. The action was canceled."
        // );
        this.fetchItems$("DEBUG_UNAUTHORIZED", true, DashboardErrorCode.Unauthorized)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    /**
     * @description
     * Shared data-loading pipeline for initial loads and forced refreshes.
     * Reuses in-flight requests to avoid parallel loads and keeps SSR resolvers consistent.
     *
     * The optional debugCode appends a query param that the mock backend understands,
     * allowing deterministic simulation of specific API error codes during development.
     */
    private fetchItems$(
        ticketId: string | null,
        force = false,
        debugCode?: DashboardErrorCode,
    ): Observable<DashboardItem[]> {
        const state = this._state();
        if (state.loading) return this.inFlightItems$ ?? of(state.data);
        if (!force && state.loaded) return of(state.data);

        this._state.update((s) => ({...s, loading: true, error: null}));
        const url = `${this.baseUrl}/dashboard/items`;
        const params = debugCode ? new HttpParams().set("debug", debugCode) : undefined;
        const context = ticketId ? new HttpContext().set(NOTIFICATION_TICKET, ticketId) : undefined;

        const request$ = this.http.get<DashboardItemDto[]>(url, {context, params}).pipe(
            map(toDashboardItems),
            tap((items) => {
                this._state.update((s) => ({...s, data: items, loaded: true}));
            }),
            catchError((err: unknown) => {
                if (hasApiErrorCode(err, DashboardErrorCode.Unauthorized)) {
                    this._state.set(createLoadableState<DashboardItem[]>([]));
                    this.authFacade.logout();
                    return of<DashboardItem[]>([]);
                }
                const apiError = extractApiError<DashboardErrorCode>(err);
                const message = apiError?.message ?? parseErrorMessage(err, "Failed to load dashboard data");
                this._state.update((s) => ({...s, error: message}));
                return of<DashboardItem[]>([]);
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
}
