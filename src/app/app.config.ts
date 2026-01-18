import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners,} from "@angular/core";
import {provideRouter, withComponentInputBinding} from "@angular/router";

import {routes} from "./app.routes";
import {provideClientHydration, withEventReplay} from "@angular/platform-browser";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {AUTH_CONFIG, authInterceptor} from "@core/auth";
import {mockBackendInterceptor} from "@core/http/mock-backend.interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {notificationInterceptor} from "@core/notifications/notification.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: AUTH_CONFIG,
      useValue: {
        oidcIssuer: "https://fake-idp.example",
        audience: "epm-progress-maker",
        stateKeyPrefix: "epm_oidc_state",
        nonceKeyPrefix: "epm_oidc_nonce"
      }
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(MatSnackBarModule),

    provideHttpClient(
      withFetch(),
      /**
       * Interceptor Chain Order is crucial:
       * 1. Auth: Adds the Bearer Token to the request.
       * 2. Notification: Listens for success/error events to show Snackbars.
       * 3. MockBackend: Simulates the server response (must be last to catch the modified request).
       */
      withInterceptors([authInterceptor, notificationInterceptor, mockBackendInterceptor]),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
