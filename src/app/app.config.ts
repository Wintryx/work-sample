import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "@core/auth";
import { mockBackendInterceptor } from "@core/http/mock-backend.interceptor";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { notificationInterceptor } from "@core/notifications/notification.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(MatSnackBarModule),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, notificationInterceptor, mockBackendInterceptor]),
    ),
    provideClientHydration(withEventReplay()),
  ],
};
