import {signal} from "@angular/core";

/**
 * @description
 * Generic state shape for loadable resources (lists, entities, etc.).
 */
export interface LoadableState<T> {
    data: T;
    loading: boolean;
    loaded: boolean;
    error: string | null;
}

/**
 * @description
 * Creates a new loadable state with default flags.
 */
export function createLoadableState<T>(data: T): LoadableState<T> {
    return {
        data,
        loading: false,
        loaded: false,
        error: null,
    };
}

/**
 * @description
 * Creates a typed Signal for a loadable state with default flags applied.
 * Keeps component/facade state initialization concise.
 */
export function createLoadableSignal<T>(data: T) {
    return signal<LoadableState<T>>(createLoadableState<T>(data));
}
