/**
 * @module FormsDomain
 * @description
 * Public API for the Forms domain.
 * Exposes page components and domain models used across the app.
 */

// Exporting Page Components for routing
export * from "./presentation/pages/forms-page/forms-page.component";
export * from "./presentation/forms.routes";

// Exporting Models if needed by other domains or shared UI
export * from "./domain/form.models";
export * from "./application/forms.validators";

/**
 * Note: The FormsFacade and internal services stay domain-private
 * unless another domain explicitly needs access.
 */
