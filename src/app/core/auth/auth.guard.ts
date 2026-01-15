// Restrict unauthorized Users to access i.Ex /dashboard.
// Uses the AuthFacade internaly to check the current State.

import {inject, PLATFORM_ID} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';
import {AuthFacade} from './auth.facade';
import {isPlatformServer} from '@angular/common';

/**
 * @description
 * Functional Guard to protect routes.
 * Uses the AuthFacade to check authentication state.
 */
export const authGuard: CanMatchFn = (_route, _segments) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    // Auf dem Server prüfen wir normalerweise den Request-Header nach dem Cookie.
    // Für die Arbeitsprobe: Wir erlauben den Render-Pass, damit der Client hydriert.
    return true;
  }

  // Im Browser haben wir den vollen State aus localStorage/hydrate()
  return authFacade.isAuthenticated() ? true : router.parseUrl('/login');
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

  return authFacade.isAuthenticated() ? router.parseUrl('/dashboard') : true;
};
