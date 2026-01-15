import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {AuthState, AuthStatus} from './auth.models';
import {CookieService} from '@core/services/cookie.service';

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
@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cookieService = inject(CookieService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'epm_auth_session';

  private readonly _state = signal<AuthState>({status: AuthStatus.Unauthenticated});
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
      const savedSession = localStorage.getItem(this.STORAGE_KEY);
      if (savedSession) {
        const session = JSON.parse(savedSession) as Extract<AuthState, { status: AuthStatus.Authenticated }>;
        this._state.set(session);
      }
    } catch (e) {
      console.error('AuthService: Failed to restore session', e);
      this.logout();
    }
  }

  /**
   * @description
   * Authenticates a user. In a real-world scenario, this would involve
   * an OIDC provider like Keycloak.
   */
  login(username: string): void {
    const session: AuthState = {
      status: AuthStatus.Authenticated,
      user: {id: `u-${Date.now()}`, username},
      token: `mock-jwt-${Date.now()}`
    };

    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      this.cookieService.set('epm_authenticated', 'true');
    }

    this._state.set(session);
  }

  /**
   * @description Clears all session data and security cookies.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.STORAGE_KEY);
      this.cookieService.delete('epm_authenticated');
    }
    this._state.set({status: AuthStatus.Unauthenticated});
  }

  /**
   * @description Returns the current JWT token or null.
   */
  getToken(): string | null {
    const s = this._state();
    return s.status === AuthStatus.Authenticated ? s.token : null;
  }
}
