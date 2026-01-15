import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    /**
     * @description Standard HttpClient configuration with functional interceptors.
     * Order matters: authInterceptor attaches token before mockBackend intercepts it.
     */
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        mockBackendInterceptor
      ])
    ),
    provideClientHydration(withEventReplay())
  ]
};
