import {InjectionToken} from "@angular/core";

/**
 * @description Configuration contract for the OIDC/Auth infrastructure.
 */
export interface AuthConfig {
  oidcIssuer: string;
  audience: string;
  stateKeyPrefix: string;
  nonceKeyPrefix: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>("AUTH_CONFIG")


/**
 * @description Authentication status constants to avoid magic strings.
 */
export enum AuthStatus {
  Authenticated = "AUTHENTICATED",
  Unauthenticated = "UNAUTHENTICATED",
}

/**
 * @description Global constants for authentication storage keys.
 */
export const AUTH_SESSION_KEY = "epm_auth_session";
export const AUTH_COOKIE_NAME = "epm_authenticated";

/**
 * @description Public User model.
 */
interface AuthUser {
  id: string;
  username: string;
}

/**
 * @description Internal state definition using Discriminated Unions.
 */
export type AuthState =
  | { status: AuthStatus.Authenticated; user: AuthUser; token: string }
  | { status: AuthStatus.Unauthenticated };

export const AuthErrorState = {
  INVALID_PASSWORD: "INVALID_PASSWORD",
  BROWSER_ONLY: "BROWSER_ONLY",
  OIDC_FLOW_FAILED: "OIDC_FLOW_FAILED",
} as const;

export type AuthErrorState = (typeof AuthErrorState)[keyof typeof AuthErrorState];

/**
 * @description
 * Discriminated Union for Auth results.
 * Provides absolute type safety for success and error branches.
 */
export type AuthResult =
  | { success: true; status: AuthStatus.Authenticated; }
  | { success: false; status: AuthStatus.Unauthenticated; authErrorState: AuthErrorState; message: string };
