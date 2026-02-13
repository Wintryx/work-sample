import { InjectionToken } from "@angular/core";
import { Result } from "@core/types/result";
import { ValueOf } from "@core/types/value-of";

/**
 * @description Configuration contract for the OIDC/Auth infrastructure.
 */
export interface AuthConfig {
  oidcIssuer: string;
  audience: string;
  stateKeyPrefix: string;
  nonceKeyPrefix: string;
}

/**
 * @description
 * Injection Token for Auth Configuration.
 * Decouples the Auth domain from specific environment files.
 */
export const AUTH_CONFIG = new InjectionToken<AuthConfig>("AUTH_CONFIG");

/**
 * @description Global constants for authentication storage keys.
 */
export const AUTH_SESSION_KEY = "wtx_auth_session";
export const AUTH_COOKIE_NAME = "wtx_authenticated";

/**
 * @description Authentication status constants to avoid magic strings.
 * Using a const object + ValueOf keeps unions consistent and tree-shakeable.
 */
export const AuthStatus = {
  Authenticated: "AUTHENTICATED",
  Unauthenticated: "UNAUTHENTICATED",
} as const;

export type AuthStatus = ValueOf<typeof AuthStatus>;

/**
 * @description Public User model.
 */
export interface AuthUser {
  id: string;
  username: string;
}

/**
 * @description Internal state definition using Discriminated Unions.
 */
export type AuthState =
  | { status: typeof AuthStatus.Authenticated; user: AuthUser; token: string }
  | { status: typeof AuthStatus.Unauthenticated };

/**
 * @description
 * Centralized auth error constants grouped by purpose.
 */
const AuthErrors = {
  State: {
    INVALID_PASSWORD: "INVALID_PASSWORD",
    BROWSER_ONLY: "BROWSER_ONLY",
    OIDC_FLOW_FAILED: "OIDC_FLOW_FAILED",
  },
  Code: {
    Unauthorized: "AUTH_UNAUTHORIZED",
  },
} as const;

/**
 * @description
 * Internal authentication error states for login flows.
 */
export const AuthErrorState = AuthErrors.State;

export type AuthErrorState = ValueOf<typeof AuthErrors.State>;

/**
 * @description
 * Typed API error codes related to authentication flows.
 */
export const AuthErrorCode = AuthErrors.Code;

export type AuthErrorCode = ValueOf<typeof AuthErrors.Code>;

/**
 * @description
 * Discriminated Union for Auth results.
 * Provides absolute type safety for ok/error branches.
 */
export type AuthResult = Result<
  { status: typeof AuthStatus.Authenticated },
  {
    status: typeof AuthStatus.Unauthenticated;
    authErrorState: AuthErrorState;
    message: string;
  }
>;
