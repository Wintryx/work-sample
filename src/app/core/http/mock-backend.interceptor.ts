import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {delay, of, throwError} from "rxjs";
import {DASHBOARD_MOCK_DATA} from "@domains/dashboard/data-access/dashboard.mock-data";
import {inject} from "@angular/core";
import {API_BASE_URL} from "@core/http/api.tokens";

/**
 * @description
 * Mock Backend Interceptor to simulate REST API responses.
 * Uses shared mock data to keep fixtures consistent across the app.
 * Essential for the Work Sample to demonstrate UI interactions without a real server.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const {url, method} = req;
  const baseUrl = inject(API_BASE_URL);

  if (url.endsWith(`${baseUrl}/dashboard/items`) && method === "GET") {
    return of(
      new HttpResponse({
        status: 200,
        body: DASHBOARD_MOCK_DATA,
      }),
    ).pipe(delay(800));
  }

  // --- NEW: ERROR SIMULATION ENDPOINT ---
  if (url === `${baseUrl}/debug/error` && method === "GET") {
    return throwError(() => new HttpErrorResponse({
      status: 500,
      statusText: "Internal Server Error",
      error: {message: "Simulated API failure for debugging purposes."}
    })).pipe(delay(500));
  }

  return next(req);
};


