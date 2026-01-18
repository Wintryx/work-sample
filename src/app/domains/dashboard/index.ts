/**
 * @module DashboardDomain
 * @description
 * Public API for the Dashboard domain.
 * Exposes page components for routing and essential models.
 */

/**
 * @description Exporting page components for the router.
 */
export * from "./dashboard-page/dashboard-page";
export * from "./item-detail-page/item-detail-page";

/**
 * @description Exporting models if they are needed by other domains (optional).
 */
export * from "./dashboard.models";

/**
 * @description Exporting providers for DI setup.
 */
export * from "./data-access/dashboard.providers";

/**
 * @description Exporting API contracts and implementations.
 */
export * from "./data-access/dashboard.api";
export * from "./data-access/dashboard.api.http";
export * from "./data-access/dashboard.api.mock";

/**
 * Note: We do NOT export the DashboardFacade here unless
 * another domain strictly needs access to the dashboard state.
 * Usually, the Facade is "domain-private".
 */
