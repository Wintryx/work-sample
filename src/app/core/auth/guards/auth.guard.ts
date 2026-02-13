// Restrict unauthorized Users from access i.Ex /dashboard.
// Uses the AuthFacade internally to check the current State.

import { inject, PLATFORM_ID, REQUEST } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { AUTH_COOKIE_NAME } from "@core/auth";
import { isPlatformServer } from "@angular/common";
import { parse } from "cookie";
import { AuthService } from "@core/auth/data-access/auth.service";

/**
 * @description
 * Reads the SSR auth cookie from the incoming request.
 * Returns true only when the cookie explicitly signals an authenticated session.
 */
function readAuthCookie(): boolean {
  const req = inject(REQUEST, { optional: true }) as { headers?: { cookie?: string } } | null;
  if (!req?.headers?.cookie) return false;
  const cookies = parse(req.headers.cookie);
  return cookies != null && cookies[AUTH_COOKIE_NAME] === "true";
}

/**
 * @description
 * Functional Guard to protect routes.
 * Uses the SSR cookie on the server and AuthService state in the browser.
 */
export const authGuard: CanMatchFn = () => {
  // const authFacade = inject(AuthFacade);
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  /**
   * @description
   * SSR guard path: allow render only with a valid auth cookie.
   * Missing cookies mean unauthenticated users during SSR, but are useful to stay on the detail page on refresh i.Ex.
   */
  if (isPlatformServer(platformId)) {
    const req = inject(REQUEST, { optional: true }) as { headers?: { cookie?: string } } | null;

    return readAuthCookie() || !req?.headers?.cookie ? true : router.parseUrl("/login");
  }

  // In the browser we rely on hydrate() restoring state from localStorage.
  return authService.isAuthenticated() ? true : router.parseUrl("/login");
};

/**
 * @description
 * Prevents authenticated users from accessing public-only routes (like /login).
 * If authenticated, redirects to /dashboard.
 * Uses the SSR cookie on the server and AuthService state in the browser.
 */
export const publicGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  /**
   * @description
   * SSR guard path: authenticated users are redirected away from public routes.
   */
  if (isPlatformServer(platformId)) {
    return readAuthCookie() ? router.parseUrl("/dashboard") : true;
  }

  return authService.isAuthenticated() ? router.parseUrl("/dashboard") : true;
};
