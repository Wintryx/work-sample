/**
 * @module DashboardDomain
 * @description
 * Public API for the Dashboard domain.
 * Exposes page components for routing and essential models.
 */

// Exporting Page Components for the router
export * from './dashboard-page/dashboard-page';
export * from './item-detail-page/item-detail-page';

// Exporting Models if they are needed by other domains (optional)
export * from './dashboard.models';

/**
 * Note: We do NOT export the DashboardFacade here unless
 * another domain strictly needs access to the dashboard state.
 * Usually, the Facade is "domain-private".
 */
