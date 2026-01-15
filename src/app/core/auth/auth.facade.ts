//   components only uses this Facade.
//   Serves currentUser = computed(...), isAuthenticated = signal(...) and
//   Methodes like login() oder logout().
//   Reason: Complexity reduction of the Service and App.


import {computed, inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {AuthStatus} from './auth.models';
import {Router} from '@angular/router';

/**
 * @description
 * Facade for Authentication.
 * Decouples the UI from the underlying AuthService implementation.
 */
@Injectable({providedIn: 'root'})
export class AuthFacade {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router); // Router injizieren

  // Computed signals for reactive UI updates
  readonly user = computed(() => {
    const s = this.authService.state();
    return s.status === AuthStatus.Authenticated ? s.user : null;
  });

  readonly isAuthenticated = computed(() =>
    this.authService.state().status === AuthStatus.Authenticated
  );


  login(username: string, _password?: string): void {
    this.authService.login(username);
    // Centralized redirect after login
    this.router.navigate(['/dashboard']);
  }

  /**
   * @description
   * Centralized logout logic.
   * Clears the state and ensures the user is redirected to a public page.
   */
  logout(): void {
    this.authService.logout();
    // Ensure the user is kicked out of protected areas immediately.
    this.router.navigate(['/login']);
  }
}
