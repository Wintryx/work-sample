/**
 * @description Authentication status constants to avoid magic strings.
 */
export enum AuthStatus {
  Authenticated = 'AUTHENTICATED',
  Unauthenticated = 'UNAUTHENTICATED',
}

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
  | { status: AuthStatus.Authenticated; user: AuthUser; token: string }
  | { status: AuthStatus.Unauthenticated };
