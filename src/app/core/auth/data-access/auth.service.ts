import { inject, Injectable, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AUTH_COOKIE_NAME, AUTH_SESSION_KEY, AuthState, AuthStatus } from "./auth.models";
import { CookieService } from "@core/services/cookie.service";

/**
 * @description
 * Implements an Isomorphic Authentication Strategy.
 *
 * Why dual persistence (localStorage + Cookies)?
 * 1. localStorage: Primary client-side store. Used for persisting the full user
 *    profile and session state. It offers larger capacity and fast synchronous access.
 * 2. Cookies: Essential SSR Bridge. Since the server (Node.js) cannot access localStorage,
 *    a cookie is used to notify server-side guards about the auth status.
 *    This prevents "auth-flicker" and incorrect redirects during initial hydration.
 */
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cookieService = inject(CookieService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _state = signal<AuthState>({ status: AuthStatus.Unauthenticated });
  readonly state = this._state.asReadonly();

  constructor() {
    this.hydrate();
  }

  /**
   * @description Restores session from localStorage during client-side hydration.
   */
  private hydrate(): void {
    if (!this.isBrowser) return;

    try {
      const savedSession = localStorage.getItem(AUTH_SESSION_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession) as Extract<
          AuthState,
          { status: AuthStatus.Authenticated }
        >;
        this._state.set(session);
      }
    } catch (e) {
      console.error("AuthService: Failed to restore session", e);
      this.logout();
    }
  }

  /**
   * @description
   * Authenticates a user. In a real-world scenario, this would involve
   * an OIDC provider like Keycloak.
   */
  login(username: string, password?: string): AuthResult {
    if (password !== "epm") {
      console.warn("AuthService: Invalid password for mock login");
      this.logout();
      return { ok: false, message: "Invalid password. Hint: epm." };
    }
    if (!this.isBrowser) {
      return { ok: false, message: "Login is only available in the browser." };
    }

    if (this.isBrowser) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      this.cookieService.set(AUTH_COOKIE_NAME, "true");
    }

    this._state.set(session);
  }

  /**
   * @description Clears all session data and security cookies.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      this.cookieService.delete(AUTH_COOKIE_NAME);
    }
    this._state.set({ status: AuthStatus.Unauthenticated });
  }

  /**
   * @description Returns the current JWT token or null.
   */
  getToken(): string | null {
    const s = this._state();
    return s.status === AuthStatus.Authenticated ? s.token : null;
  }
}
