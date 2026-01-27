import {InjectionToken} from "@angular/core";
import {Result} from "@core/types/result";
import {ValueOf} from "@core/types/value-of";

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
 * @description Authentication status constants to avoid magic strings.
 * Using a const object + ValueOf keeps unions consistent and tree-shakeable.
 */
export const AuthStatus = {
    Authenticated: "AUTHENTICATED",
    Unauthenticated: "UNAUTHENTICATED",
} as const;

export type AuthStatus = ValueOf<typeof AuthStatus>;
export type AuthenticatedStatus = typeof AuthStatus.Authenticated;
export type UnauthenticatedStatus = typeof AuthStatus.Unauthenticated;

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
    | { status: AuthenticatedStatus; user: AuthUser; token: string }
    | { status: UnauthenticatedStatus };

export const AuthErrorState = {
    INVALID_PASSWORD: "INVALID_PASSWORD",
    BROWSER_ONLY: "BROWSER_ONLY",
    OIDC_FLOW_FAILED: "OIDC_FLOW_FAILED",
} as const;

export type AuthErrorState = ValueOf<typeof AuthErrorState>;

/**
 * @description
 * Typed API error codes related to authentication flows.
 */
export const AuthErrorCode = {
    Unauthorized: "AUTH_UNAUTHORIZED",
} as const;

export type AuthErrorCode = ValueOf<typeof AuthErrorCode>;

export interface AuthSuccess {
    status: AuthenticatedStatus;
}

export interface AuthFailure {
    status: UnauthenticatedStatus;
    authErrorState: AuthErrorState;
    message: string;
}

/**
 * @description
 * Discriminated Union for Auth results.
 * Provides absolute type safety for ok/error branches.
 */
export type AuthResult = Result<AuthSuccess, AuthFailure>;
