// Attached the Authorization: Bearer <token> Header on
// outgoing API-Requests.

import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

/**
 * @function authInterceptor
 * @description Standard functional interceptor to inject Bearer tokens.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {Authorization: `Bearer ${token}`}
  });

  return next(authReq);
};
