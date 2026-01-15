//   Raw Logic: Login-Calls (via HttpClient), Token-Storage
//   (LocalStorage/SessionStorage), and the  Signal for the current State.
//   ToDo: implement Keycloak-Library.

import {Injectable, signal} from '@angular/core';
import {AuthState, AuthStatus} from './auth.models';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly STORAGE_KEY = 'epm_auth_token';

  // Initialize with Enum constant
  private readonly _state = signal<AuthState>({status: AuthStatus.Unauthenticated});

  readonly state = this._state.asReadonly();

  constructor() {
    this.hydrate();
  }

  private hydrate(): void {
    const token = localStorage.getItem(this.STORAGE_KEY);
    if (token) {
      this._state.set({
        status: AuthStatus.Authenticated,
        user: {id: 'u-1', username: 'Demo User'},
        token
      });
    }
  }

  login(username: string): void {
    const mockToken = `mock-jwt-${Date.now()}`;
    localStorage.setItem(this.STORAGE_KEY, mockToken);

    this._state.set({
      status: AuthStatus.Authenticated,
      user: {id: 'u-1', username},
      token: mockToken
    });
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this._state.set({status: AuthStatus.Unauthenticated});
  }

  getToken(): string | null {
    const s = this._state();
    return s.status === AuthStatus.Authenticated ? s.token : null;
  }
}
