import {ValueOf} from "@core/types/value-of";

/**
 * @description
 * Dashboard-specific API error codes to keep transport errors strongly typed.
 */
export const DashboardErrorCode = {
    ItemsLoadFailed: "DASHBOARD_ITEMS_LOAD_FAILED",
    Unauthorized: "DASHBOARD_UNAUTHORIZED",
} as const;

/**
 * @description
 * Union of all dashboard API error codes.
 */
export type DashboardErrorCode = ValueOf<typeof DashboardErrorCode>;
