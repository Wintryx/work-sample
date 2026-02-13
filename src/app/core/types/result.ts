/**
 * @description
 * Generic result type for success/error flows across domains.
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
