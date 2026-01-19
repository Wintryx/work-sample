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
