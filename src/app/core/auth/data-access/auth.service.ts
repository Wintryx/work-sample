import {computed, inject, Injectable, PLATFORM_ID, signal} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {
    AUTH_CONFIG,
    AUTH_COOKIE_NAME,
    AUTH_SESSION_KEY,
    AuthErrorState,
    AuthResult,
    AuthState,
    AuthStatus
} from "@core/auth";
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
    readonly isAuthenticated = computed(
        () => this.state().status === AuthStatus.Authenticated,
    );
    private readonly platformId = inject(PLATFORM_ID);
    private readonly cookieService = inject(CookieService);
    private readonly isBrowser = isPlatformBrowser(this.platformId);
    private readonly config = inject(AUTH_CONFIG);
    private readonly _state = signal<AuthState>({status: AuthStatus.Unauthenticated});
    readonly state = this._state.asReadonly();

    constructor() {
        this.hydrate();
    }

    /**
     * @description
     * Authenticates a user.
     *
     * **MOCK IMPLEMENTATION NOTICE:**
     * In this fake implementation, we accept `username` and `password` directly to
     * simulate the Identity Provider's validation logic locally.
     *
     * **REAL WORLD OIDC:**
     * In a real OIDC "Authorization Code Flow", this method would take NO arguments.
     * Instead, it would redirect the browser to an external login page (e.g., Keycloak),
     * ensuring the Angular app never handles the user's plain-text password.
     *
     * @returns Result object with success flag or error message.
     */
    login(username: string, password: string): AuthResult {
        if (password !== "epm") {
            console.warn("AuthService: Invalid password for mock login");
            this.logout();
            return {
                ok: false,
                error: {
                    status: AuthStatus.Unauthenticated,
                    authErrorState: AuthErrorState.INVALID_PASSWORD,
                    message: "Invalid password. Hint: epm."
                },
            };
        }
        if (!this.isBrowser) {
            return {
                ok: false,
                error: {
                    status: AuthStatus.Unauthenticated,
                    authErrorState: AuthErrorState.BROWSER_ONLY,
                    message: "Login is only available in the browser."
                },
            };
        }

        try {
            const {code, state, nonce} = this.startFakeOidcFlow();
            const session = this.finishFakeOidcFlow({code, state, nonce, username});

            localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
            this.cookieService.set(AUTH_COOKIE_NAME, "true");
            this._state.set(session);
            return {
                ok: true,
                value: {
                    status: AuthStatus.Authenticated,
                },
            };
        } catch (e) {
            console.error("AuthService: Fake OIDC login failed", e);
            this.logout();
            return {
                ok: false,
                error: {
                    status: AuthStatus.Unauthenticated,
                    authErrorState: AuthErrorState.OIDC_FLOW_FAILED,
                    message: "Login failed. Please try again."
                },
            };
        }
    }

    /**
     * @description Clears all session data and security cookies.
     */
    logout(): void {
        if (this.isBrowser) {
            localStorage.removeItem(AUTH_SESSION_KEY);
            this.cookieService.delete(AUTH_COOKIE_NAME);
            sessionStorage.removeItem(this.config.stateKeyPrefix);
            sessionStorage.removeItem(this.config.nonceKeyPrefix);
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
     * Re-initializes the session state from `localStorage` on application startup.
     *
     * This method runs only in the browser (client-side) to restore the user's
     * previous session, allowing for a seamless "Stay Logged In" experience.
     * * Note: Server-side validation relies on the `epm_authenticated` cookie instead.
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
     * Simulates the **OIDC Authorization Request**.
     *
     * In a real application, this method would construct a URL and redirect the browser
     * to the Identity Provider (e.g., Keycloak).
     *
     * It generates two critical security parameters:
     * 1. **State**: Protection against CSRF attacks. We save it locally to verify the callback later.
     * 2. **Nonce**: Protection against Replay attacks. Ensures the token we get back was generated specifically for this request.
     *
     * @returns {Object} An object containing the generated parameters and a mock Authorization Code.
     */
    private startFakeOidcFlow(): { code: string; state: string; nonce: string } {
        const state = this.randomId("state");
        const nonce = this.randomId("nonce");
        sessionStorage.setItem(this.config.stateKeyPrefix, state);
        sessionStorage.setItem(this.config.nonceKeyPrefix, nonce);

        return {code: this.randomId("code"), state, nonce};
    }

    /**
     * @description
     * Simulates the **OIDC Token Exchange**.
     *
     * This represents the step where the frontend sends the "Authorization Code"
     * back to the backend to exchange it for an Access Token.
     *
     * **Security Check:**
     * It validates that the `state` and `nonce` returned from the flow match
     * the ones we stored in `sessionStorage` during the start phase.
     * If they don't match, the flow is rejected (potential attack).
     *
     * @param params - The parameters returned from the "login screen" (code, state, nonce).
     * @throws {Error} If state or nonce validation fails.
     * @returns {AuthState} The authenticated session object including the signed JWT.
     */
    private finishFakeOidcFlow(params: {
        code: string;
        state: string;
        nonce: string;
        username: string;
    }): Extract<AuthState, { status: AuthStatus.Authenticated }> {
        const expectedState = sessionStorage.getItem(this.config.stateKeyPrefix);
        const expectedNonce = sessionStorage.getItem(this.config.nonceKeyPrefix);
        if (expectedState !== params.state || expectedNonce !== params.nonce) {
            throw new Error("OIDC state/nonce mismatch");
        }

        sessionStorage.removeItem(this.config.stateKeyPrefix);
        sessionStorage.removeItem(this.config.nonceKeyPrefix);

        const userId = `u-${Date.now()}`;
        const now = Math.floor(Date.now() / 1000);
        const accessToken = this.createFakeJwt({
            iss: this.config.oidcIssuer,
            aud: this.config.audience,
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
     * Helper utility to construct a **JWT (JSON Web Token)**.
     *
     * Structure: `Header.Payload.Signature`
     *
     * **Note:** This creates an "unsigned" token (`alg: none`).
     * While it is structurally valid base64url JSON and can be parsed by
     * libraries like `jwt-decode`, it offers no cryptographic integrity
     * and should **NEVER** be used in production environments.
     *
     * @param payload - The business data (claims) to encode into the token.
     * @returns {string} The base64url encoded JWT string.
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
