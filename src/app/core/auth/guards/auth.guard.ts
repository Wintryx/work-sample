// Restrict unauthorized Users from access i.Ex /dashboard.
// Uses the AuthFacade internally to check the current State.

import {inject, PLATFORM_ID, REQUEST} from "@angular/core";
import {CanMatchFn, Router} from "@angular/router";
import {AUTH_COOKIE_NAME, AuthFacade} from "@core/auth";
import {isPlatformServer} from "@angular/common";
import {parse} from "cookie";

/**
 * @description
 * Functional Guard to protect routes.
 * Uses the AuthFacade to check authentication state.
 */
export const authGuard: CanMatchFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    const req = inject(REQUEST, { optional: true }) as { headers?: { cookie?: string } } | null;
    // In SSR/prerender, REQUEST can be null; allow render pass to avoid crashes.
    if (!req?.headers?.cookie) {
      return true;
    }
    // Cookie acts as a lightweight SSR signal to avoid redirect flicker on first render.
    const cookies = parse(req.headers.cookie);
    return cookies != null && cookies[AUTH_COOKIE_NAME] === "true"
      ? true
      : router.parseUrl("/login");
  }

  // In the browser we rely on hydrate() restoring state from localStorage.
  return authFacade.isAuthenticated() ? true : router.parseUrl("/login");
};

/**
 * @description
 * Prevents authenticated users from accessing public-only routes (like /login).
 * If authenticated, redirects to /dashboard.
 */
export const publicGuard: CanMatchFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) return true;

  return authFacade.isAuthenticated() ? router.parseUrl("/dashboard") : true;
};
