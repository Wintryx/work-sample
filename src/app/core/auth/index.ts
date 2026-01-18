/**
 * @module CoreAuth
 * @description
 * Entry point for the Authentication module.
 * Follows the Facade Pattern to encapsulate internal service logic.
 */

/**
 * @publicApi
 * Main interface for UI components to interact with authentication state.
 */
export * from "./auth.facade";

/**
 * @publicApi
 * Routing guard to protect unauthorized access to protected domains.
 */
export * from "./guards/auth.guard";

/**
 * @internalApi
 * HTTP Interceptor for injecting Bearer tokens.
 * Exported for registration in the global application configuration.
 */
export * from "./data-access/auth.interceptor";
/**
 * @publicApi
 * Common types and enums for authentication.
 */
export * from "./data-access/auth.models";

/**
 * @internalApi
 * Configuration Injection Token and Interface.
 * Required to provide the specific OIDC settings at the application root level.
 */
export * from "./auth.config";
