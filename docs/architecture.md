# Architectural Overview

## 1. Domain-Driven Structure
To support a team of 2 developers and ensure scalability, the project follows a **Domain-Driven Design (DDD)** approach within the Angular workspace.

- **`core/`**: Global, singleton infrastructure (Auth, HTTP, Notifications, Guards).
- **`domains/`**: Business-specific features. Each domain is self-contained.
- **`shared/`**: Reusable UI components, pipes, and directives without business logic.

## 2. Standalone Components & Public API
- All UI building blocks are **standalone components**, which keeps feature modules light.
- Each folder exposes a **Public API** via `index.ts` (barrel file).
- Internal implementations are hidden; consumers import via **path aliases** (e.g., `@core/auth`).

## 3. Dependency Injection & Configuration
- Global configuration is centralized in `app.config.ts`.
- Runtime configuration is injected via **tokens** (e.g., `API_BASE_URL`, `AUTH_CONFIG`).
- Functional providers (e.g., `provideAuth`) group related DI setup.
- `withComponentInputBinding()` enables route params as input signals.

## 4. State Management & Facades
- **Signals** are the primary state mechanism with `computed` selectors for UI binding.
- State is **encapsulated**: writable signals are private, read-only access is exposed.
- **Facades** (e.g., `AuthFacade`, `DashboardFacade`) orchestrate state and UI workflows.
- Data fetching happens at the Facade layer and updates Signals directly.

## 5. HTTP Pipeline & Interceptors
- HTTP requests are handled through `HttpClient` with a consistent interceptor chain:
  1. **Auth**: adds the Bearer token if present.
  2. **Notification**: triggers snackbars for success/error.
  3. **Mock Backend**: simulates API responses for the work sample.
- `HttpContext` is used to pass notification tickets without coupling UI logic to HTTP.

## 6. SSR & Rendering Modes
- The app uses **Angular SSR** with client hydration (`provideClientHydration`).
- Protected routes are **server-rendered** using `RenderMode.Server`.
- Public routes are **prerendered** for fast static delivery.
- Auth uses a cookie as an SSR bridge to avoid redirect flicker on first render.

## 7. Routing & Guards
- `authGuard` protects private routes (e.g., `/dashboard`).
- `publicGuard` prevents authenticated users from accessing `/login`.
- Guards are functional and rely on the `AuthFacade` state.

## 8. Notifications & UX Feedback
- `NotificationService` standardizes user feedback.
- `notificationInterceptor` allows centralized success/error messaging.
- UI components remain clean and do not handle toast logic directly.

## 9. Testing
- Tests are written with **Vitest** for speed and ESM compatibility.
- See `docs/testing-strategy.md` for detailed guidelines and patterns.

## 10. Extensibility
- Auth can be switched from the mock flow to a real OIDC provider (e.g., Keycloak).
- The HTTP pipeline is ready for a real backend by removing the mock interceptor.
- The architecture keeps UI and infrastructure decoupled for easy replacement.
