import {inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {AUTH_COOKIE_NAME, AUTH_SESSION_KEY, AuthResult, AuthState, AuthStatus} from "@core/auth";
import {CookieService} from "@core/services/cookie.service";

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
@Injectable({providedIn: "root"})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cookieService = inject(CookieService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  /** @description OIDC state key used for the fake authorization flow. */
  private readonly oidcStateKey = "epm_oidc_state";
  /** @description OIDC nonce key used to simulate replay protection. */
  private readonly oidcNonceKey = "epm_oidc_nonce";
  /** @description Fake issuer to emulate an external OIDC provider. */
  private readonly oidcIssuer = "https://fake-idp.example";

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
   * @returns Result object with success flag or error message.
   */
  login(username: string, password?: string): AuthResult {
    if (password !== "epm") {
      console.warn("AuthService: Invalid password for mock login");
      this.logout();
      return {ok: false, message: "Invalid password. Hint: epm."};
    }
    if (!this.isBrowser) {
      return {ok: false, message: "Login is only available in the browser."};
    }

    try {
      const {code, state, nonce} = this.startFakeOidcFlow();
      const session = this.finishFakeOidcFlow({code, state, nonce, username});

      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      this.cookieService.set(AUTH_COOKIE_NAME, "true");
      this._state.set(session);
      return {ok: true};
    } catch (e) {
      console.error("AuthService: Fake OIDC login failed", e);
      this.logout();
      return {ok: false, message: "Login failed. Please try again."};
    }
  }

  /**
   * @description Clears all session data and security cookies.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(AUTH_SESSION_KEY);
      this.cookieService.delete(AUTH_COOKIE_NAME);
      sessionStorage.removeItem(this.oidcStateKey);
      sessionStorage.removeItem(this.oidcNonceKey);
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

  /**
   * @description
   * Starts a fake OIDC flow by generating state/nonce and a mock auth code.
   */
  private startFakeOidcFlow(): { code: string; state: string; nonce: string } {
    const state = this.randomId("state");
    const nonce = this.randomId("nonce");
    sessionStorage.setItem(this.oidcStateKey, state);
    sessionStorage.setItem(this.oidcNonceKey, nonce);

    return {code: this.randomId("code"), state, nonce};
  }

  /**
   * @description
   * Finalizes the fake OIDC flow by validating state/nonce and minting a token.
   */
  private finishFakeOidcFlow(params: {
    code: string;
    state: string;
    nonce: string;
    username: string;
  }): Extract<AuthState, { status: AuthStatus.Authenticated }> {
    const expectedState = sessionStorage.getItem(this.oidcStateKey);
    const expectedNonce = sessionStorage.getItem(this.oidcNonceKey);
    if (expectedState !== params.state || expectedNonce !== params.nonce) {
      throw new Error("OIDC state/nonce mismatch");
    }

    sessionStorage.removeItem(this.oidcStateKey);
    sessionStorage.removeItem(this.oidcNonceKey);

    const userId = `u-${Date.now()}`;
    const now = Math.floor(Date.now() / 1000);
    const accessToken = this.createFakeJwt({
      iss: this.oidcIssuer,
      aud: "epm-progress-maker",
      sub: userId,
      preferred_username: params.username,
      iat: now,
      exp: now + 3600,
      nonce: params.nonce,
      code: params.code,
    });

    return {
      status: AuthStatus.Authenticated,
      user: {id: userId, username: params.username},
      token: accessToken,
    };
  }

  /**
   * @description
   * Creates a base64url-encoded JWT-like string without a signature.
   */
  private createFakeJwt(payload: Record<string, unknown>): string {
    const header = {alg: "none", typ: "JWT"};
    const toBase64Url = (input: string): string => {
      if (typeof btoa === "function") {
        const binary = encodeURIComponent(input).replace(
          /%([0-9A-F]{2})/g,
          (_, p1) => String.fromCharCode(parseInt(p1, 16)),
        );
        return btoa(binary).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      return input;
    };

    return `${toBase64Url(JSON.stringify(header))}.${toBase64Url(
      JSON.stringify(payload),
    )}.`;
  }

  /**
   * @description
   * Generates a pseudo-random identifier. Uses crypto.randomUUID when available.
   */
  private randomId(prefix: string): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
