//   components only uses this Facade.
//   Serves currentUser = computed(...), isAuthenticated = signal(...) and
//   Methodes like login() oder logout().
//   Reason: Complexity reduction of the Service and App.


import {computed, inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthStatus} from './auth.models';

/**
 * @description
 * Facade for Authentication.
 * Decouples the UI from the underlying AuthService implementation.
 */
@Injectable({providedIn: 'root'})
export class AuthFacade {
  private readonly authService = inject(AuthService);

  // Computed signals for reactive UI updates
  readonly user = computed(() => {
    const s = this.authService.state();
    return s.status === AuthStatus.Authenticated ? s.user : null;
  });

  readonly isAuthenticated = computed(() =>
    this.authService.state().status === AuthStatus.Authenticated
  );

  login(username: string, _password?: string): void {
    // We only pass username for the mock, but the API is ready for password.
    this.authService.login(username);
  }

  logout(): void {
    this.authService.logout();
  }
}
