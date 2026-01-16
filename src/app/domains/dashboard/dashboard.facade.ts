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

import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DashboardItemDto} from './dashboard.models';
import {finalize} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

/**
 * @description Internal state for the Dashboard.
 */
interface DashboardState {
  items: DashboardItemDto[];
  loading: boolean;
  error: string | null;
}

@Injectable({providedIn: 'root'})
export class DashboardFacade {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  // Private state using a Signal
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
   * @description Fetches items from the mock backend.
   */
  loadItems(): void {
    this._state.update((s) => ({...s, loading: true, error: null}));

    this.http
      .get<DashboardItemDto[]>('/api/dashboard/items')
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
        error: (err) => {
          this._state.update((s) => ({
            ...s,
            error: err.message || 'Failed to load dashboard data',
          }));
        },
      });
  }

  /**
   * @description Example of a domain-specific action.
   */
  refresh(): void {
    this.loadItems();
  }
}
