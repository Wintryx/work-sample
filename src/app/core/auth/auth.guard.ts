// Restrict unauthorized Users to access i.Ex /dashboard.
// Uses the AuthFacade internaly to check the current State.

import {inject} from '@angular/core';
import {CanMatchFn, Router} from '@angular/router';
import {AuthFacade} from './auth.facade';

/**
 * @description
 * Functional Guard to protect routes.
 * Uses the AuthFacade to check authentication state.
 */
export const authGuard: CanMatchFn = (_route, _segments) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    return true;
  }

  // Redirect to login if not authenticated
  return router.parseUrl('/login');
};
