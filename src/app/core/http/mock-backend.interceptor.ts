import {HttpErrorResponse, HttpInterceptorFn, HttpResponse} from "@angular/common/http";
import {delay, mergeMap, of, throwError, timer} from "rxjs";
import {DashboardItemDto, ItemStatus} from "@domains/dashboard/domain/dashboard.models";
import {DashboardErrorCode} from "@domains/dashboard/domain/dashboard.error-codes";
import {inject} from "@angular/core";
import {API_BASE_URL} from "@core/http/api.tokens";
import {AuthErrorCode} from "@core/auth";

/**
 * @description
 * Mock data typed with DashboardItemDto to ensure contract consistency.
 */
const MOCK_DASHBOARD_DATA: DashboardItemDto[] = [
    {id: "1", title: "Feature: Login Logic", status: ItemStatus.Done, progress: 100},
    {id: "2", title: "Feature: Dashboard Table", status: ItemStatus.InProgress, progress: 45},
    {id: "3", title: "Feature: Unit Tests", status: ItemStatus.Todo, progress: 0},
    {id: "4", title: "Feature: SSR Guard", status: ItemStatus.Done, progress: 100},
    {id: "5", title: "Feature: Notifications", status: ItemStatus.InProgress, progress: 70},
    {id: "6", title: "Feature: Auth Tokens", status: ItemStatus.InProgress, progress: 55},
    {id: "7", title: "Feature: Layout Shell", status: ItemStatus.Done, progress: 100},
    {id: "8", title: "Feature: Item Detail", status: ItemStatus.Done, progress: 100},
    {id: "9", title: "Feature: Resolver Loading", status: ItemStatus.Done, progress: 100},
    {id: "10", title: "Feature: Mock Backend", status: ItemStatus.InProgress, progress: 60},
    {id: "11", title: "Feature: Error Handling", status: ItemStatus.InProgress, progress: 50},
    {id: "12", title: "Feature: Auth Guards", status: ItemStatus.Done, progress: 100},
    {id: "13", title: "Feature: Table Actions", status: ItemStatus.InProgress, progress: 35},
    {id: "14", title: "Feature: Status Badges", status: ItemStatus.Done, progress: 100},
    {id: "15", title: "Feature: Responsive Layout", status: ItemStatus.InProgress, progress: 40},
    {id: "16", title: "Feature: Code Quality", status: ItemStatus.Done, progress: 100},
    {id: "17", title: "Feature: Data Mapping", status: ItemStatus.Done, progress: 100},
    {id: "18", title: "Feature: State Management", status: ItemStatus.InProgress, progress: 65},
    {id: "19", title: "Feature: Testing Strategy", status: ItemStatus.InProgress, progress: 30},
    {id: "20", title: "Feature: Release Checklist", status: ItemStatus.Todo, progress: 0},
];

/**
 * @description
 * Mock Backend Interceptor to simulate REST API responses.
 * Essential for the Work Sample to demonstrate UI interactions without a real server.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
    const {url, method} = req;
    const baseUrl = inject(API_BASE_URL);

    if (url.endsWith(`${baseUrl}/dashboard/items`) && method === "GET") {
        const debugCode = req.params.get("debug");
        if (debugCode === DashboardErrorCode.Unauthorized) {
            return timer(800).pipe(
                mergeMap(() =>
                    throwError(() => new HttpErrorResponse({
                        status: 401,
                        statusText: "Unauthorized",
                        error: {
                            status: 401,
                            message: "Session expired. Please log in again.",
                            code: DashboardErrorCode.Unauthorized,
                        },
                    })),
                ),
            );
        }

        return of(
            new HttpResponse({
                status: 200,
                body: MOCK_DASHBOARD_DATA,
            }),
        ).pipe(delay(800));
    }

    if (url === `${baseUrl}/debug/error` && method === "GET") {
        return timer(800).pipe(
            mergeMap(() =>
                throwError(() => new HttpErrorResponse({
                    status: 500,
                    statusText: "Internal Server Error",
                    error: {
                        status: 500,
                        message: "Simulated API failure for debugging purposes.",
                        code: DashboardErrorCode.ItemsLoadFailed,
                    }
                })),
            ),
        );
    }

    if (url === `${baseUrl}/debug/unauthorized` && method === "GET") {
        return timer(800).pipe(
            mergeMap(() =>
                throwError(() => new HttpErrorResponse({
                    status: 401,
                    statusText: "Unauthorized",
                    error: {
                        status: 401,
                        message: "Session expired. Please log in again.",
                        code: AuthErrorCode.Unauthorized,
                    },
                })),
            ),
        );
    }

    return next(req);
};
