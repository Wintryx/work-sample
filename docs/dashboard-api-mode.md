# Dashboard API Mode (useMockApi) - Behavior Notes

This document explains how the dashboard data flow changes depending on the
`environment.useMockApi` flag. It is meant as a short reference for this
work sample and interviews.

## 1) Provider Selection at App Startup
In `app.config.ts` the DI token `DASHBOARD_API` is bound to one of two
implementations based on `environment.useMockApi`:

- `true`  -> `DashboardApiMock`
- `false` -> `DashboardApiHttp`

Additionally, the `mockBackendInterceptor` is only enabled when
`useMockApi` is `true`.

## 2) Flow When useMockApi = true (Mock Mode)
Step-by-step:
1. `DashboardFacade.loadItems()` calls `this.api.loadItems()`.
2. `this.api` is `DashboardApiMock`.
3. The mock API returns `DASHBOARD_MOCK_DATA` as an Observable (with delay).
4. No real HTTP request is made.
5. The Facade updates its state with the mock items.

Result:
- Predictable, local data
- Fast demos without a backend
- Interceptor is enabled but unused because no HTTP call happens

## 3) Flow When useMockApi = false (Real HTTP Mode)
Step-by-step:
1. `DashboardFacade.loadItems()` calls `this.api.loadItems()`.
2. `this.api` is `DashboardApiHttp`.
3. The HTTP client calls `${API_BASE_URL}/dashboard/items`.
4. `mockBackendInterceptor` is disabled, so the real backend responds.
5. The Facade updates its state with the real items.

Result:
- Real backend data
- Production-like behavior

## 4) Why This Design
- Keeps the Facade free of HTTP and environment concerns.
- Allows swapping data sources (mock, real, codegen) without touching UI logic.
- Prepares the codebase for future OpenAPI/Codegen clients via a small adapter.

## 5) Quick Summary
- `useMockApi = true`  -> Mock API, local data, no real HTTP.
- `useMockApi = false` -> Real HTTP, production-like behavior.
