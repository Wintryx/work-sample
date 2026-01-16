import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {authInterceptor} from '@core/auth';
import {mockBackendInterceptor} from '@core/http/mock-backend.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    /**
     * @description Standard HttpClient configuration with functional interceptors.
     * Order matters: authInterceptor attaches token before mockBackend intercepts it.
     */
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,
        mockBackendInterceptor
      ])
    ),
    provideClientHydration(withEventReplay())
  ]
};
