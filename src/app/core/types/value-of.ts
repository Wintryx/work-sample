/**
 * @description
 * Utility type that extracts the union of all values from a const object.
 * Keeps status/error unions concise and avoids enum runtime output.
 */
export type ValueOf<T> = T[keyof T];
