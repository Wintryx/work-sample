import {InjectionToken} from '@angular/core';

/**
 * @description
 * Injection Token for the Base API URL.
 * Allows switching between dev/prod/mock environments easily.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api' // Default base path
});
