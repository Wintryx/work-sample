import {Provider} from "@angular/core";
import {AUTH_CONFIG, AuthConfig} from "@core/auth";


/**
 * @description
 * Pattern: Functional Provider for Auth.
 * Encapsulates all auth-related providers into a single, clean function.
 * This makes app.config.ts much easier to maintain.
 */
export function provideAuth(config: AuthConfig): Provider[] {
  return [
    {
      provide: AUTH_CONFIG,
      useValue: config,
    },
  ];
}
