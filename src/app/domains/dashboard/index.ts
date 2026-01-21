/**
 * @module DashboardDomain
 * @description
 * Public API for the Dashboard domain.
 * Exposes page components for routing and essential models.
 */

// Exporting Page Components for the router
export * from "./presentation/pages/dashboard-page/dashboard-page.component";
export * from "./presentation/pages/item-detail-page/item-detail-page.component";

// Exporting Models if they are needed by other domains (optional)
export * from "./domain/dashboard.models";

/**
 * Note: We do NOT export the DashboardFacade here unless
 * another domain strictly needs access to the dashboard state.
 * Usually, the Facade is "domain-private".
 */
