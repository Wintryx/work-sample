import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { authInterceptor, provideAuth } from "@core/auth";
import { mockBackendInterceptor } from "@core/http/mock-backend.interceptor";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { notificationInterceptor } from "@core/notifications/notification.interceptor";
import { API_BASE_URL } from "@core/http/api.tokens";
import { environment } from "@env/environment";
import { FORMS_VALIDATOR_PROVIDERS } from "@domains/forms";

const httpInterceptors = environment.useMockBackend
  ? [authInterceptor, notificationInterceptor, mockBackendInterceptor]
  : [authInterceptor, notificationInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideAuth({
      oidcIssuer: environment.oidc.issuer,
      audience: environment.oidc.audience,
      stateKeyPrefix: "wtx_oidc_state",
      nonceKeyPrefix: "wtx_oidc_nonce",
    }),
    importProvidersFrom(MatSnackBarModule),
    provideHttpClient(
      withFetch(),
      /**
       * Interceptor Chain Order is crucial:
       * 1. Auth: Adds the Bearer Token to the request.
       * 2. Notification: Listens for success/error events to show Snackbars.
       * 3. MockBackend: Simulates server responses for the work sample (kept last to catch the modified request).
       */
      withInterceptors(httpInterceptors),
    ),
    provideClientHydration(withEventReplay(), withHttpTransferCacheOptions({})),
    ...FORMS_VALIDATOR_PROVIDERS,
  ],
};
