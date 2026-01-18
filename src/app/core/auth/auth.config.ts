// core/auth/auth.config.ts
import {InjectionToken} from "@angular/core";

/**
 * @description
 * Defines the configuration shape for the Authentication module.
 * This allows the AuthService to be independent of environment files.
 */
export interface AuthConfig {
  oidcIssuer: string;
  audience: string;
  stateKeyPrefix: string;
  nonceKeyPrefix: string;
}

/**
 * @description
 * Dependency Injection Token for the Auth Configuration.
 * Use this token to inject the config into services/interceptors.
 */
export const AUTH_CONFIG = new InjectionToken<AuthConfig>("AUTH_CONFIG");
