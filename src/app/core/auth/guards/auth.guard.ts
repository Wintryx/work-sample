// Restrict unauthorized users from access (e.g. /dashboard).
// Uses SSR cookie checks on the server and AuthService state in the browser.

import {inject, PLATFORM_ID, REQUEST} from "@angular/core";
import {CanMatchFn, Router} from "@angular/router";
import {AUTH_COOKIE_NAME, AuthStatus} from "@core/auth";
import {isPlatformServer} from "@angular/common";
import {parse} from "cookie";
import {AuthService} from "../data-access/auth.service";

/**
 * @description
 * Reads the SSR auth cookie from the incoming request.
 * Returns true only when the cookie explicitly signals an authenticated session.
 */
function readAuthCookie(): boolean {
  const req = inject(REQUEST, {optional: true}) as {headers?: {cookie?: string}} | null;
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
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    // Cookie acts as a lightweight SSR signal to avoid protected SSR rendering.
    return readAuthCookie() ? true : router.parseUrl("/login");
  }

  // In the browser we rely on hydrate() restoring state from localStorage.
  return authService.state().status === AuthStatus.Authenticated
    ? true
    : router.parseUrl("/login");
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

  if (isPlatformServer(platformId)) {
    return readAuthCookie() ? router.parseUrl("/dashboard") : true;
  }

  return authService.state().status === AuthStatus.Authenticated
    ? router.parseUrl("/dashboard")
    : true;
};
