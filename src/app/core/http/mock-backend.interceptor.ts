import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { delay, of } from "rxjs";
import { DashboardItemDto, ItemStatus } from "@domains/dashboard/dashboard.models";
import { inject } from "@angular/core";
import { API_BASE_URL } from "@core/http/api.tokens";

/**
 * @description
 * Mock data typed with DashboardItemDto to ensure contract consistency.
 */
const MOCK_DASHBOARD_DATA: DashboardItemDto[] = [
  { id: "1", title: "Feature: Login Logic", status: ItemStatus.Done, progress: 100 },
  { id: "2", title: "Feature: Dashboard Table", status: ItemStatus.InProgress, progress: 45 },
  { id: "3", title: "Feature: Unit Tests", status: ItemStatus.Todo, progress: 0 },
];

/**
 * @description
 * Mock Backend Interceptor to simulate REST API responses.
 * Essential for the Work Sample to demonstrate UI interactions without a real server.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;
  const baseUrl = inject(API_BASE_URL);

  if (url.endsWith(`${baseUrl}/dashboard/items`) && method === "GET") {
    return of(
      new HttpResponse({
        status: 200,
        body: MOCK_DASHBOARD_DATA,
      }),
    ).pipe(delay(800));
  }

  return next(req);
};
