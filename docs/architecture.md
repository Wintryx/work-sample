# Architectural Overview

## 1. Domain-Driven Design (DDD) & Layering
To ensure scalability for a team of 2+ developers, the project follows a strict **Vertical Slicing** approach combined with specialized internal layering:

- **`core/`**: Global infrastructure singletons (Auth, HTTP, Notifications, Layout).
    - Internal layering: `data-access/` (Services/Models), `guards/`, `layout/`.
- **`domains/`**: Business-specific features. Each domain is strictly isolated and partitioned:
    - **`domain/`**: Pure logic, interfaces, and typed constants (e.g., `ItemStatus`).
    - **`application/`**: Orchestration layer using the **Facade Pattern**.
    - **`presentation/`**: UI logic, including `pages/` (smart) and `components/` (dumb).
- **`shared/`**: Reusable, stateless UI building blocks (Badges, Buttons) and Pipes.

## 2. Encapsulation & Public API
- **Barrel Files**: Each module folder exposes a **Public API** via `index.ts`. External consumers are forbidden from importing internal files directly.
- **Path Aliases**: Clean imports are enforced via TypeScript aliases (e.g., `@core/*`, `@domains/*`, `@shared/*`), preventing brittle relative paths.
- **SOLID Mindset**: The architecture is intentionally aligned with SOLID principles (SRP via Facades/Services, OCP via Interceptors, DIP via DI tokens), and the current codebase already reflects these patterns.

## 3. State Management (Angular Signals)
- **Signals-First**: Primary state mechanism using Angular 21 Signals for fine-grained reactivity.
- **Facade Pattern**: Components interact exclusively with Facades. This abstracts away the `HttpClient` and complex state transitions.
- **Resolver-Driven Loading**: Initial domain data is loaded via route resolvers (SSR-safe). Facades expose `ensureLoaded()` and keep `computed()` selectors side-effect free while deduplicating in-flight requests.
- **Resource Management**: Use of `takeUntilDestroyed()` ensures automatic unsubscription and prevents memory leaks.

## 4. HTTP Pipeline & Security
- **Interceptor Chain**: A strictly ordered pipeline:
    1. **Auth**: Injects JWT Bearer tokens.
    2. **Notification**: Monitors `HttpContext` for automated UI feedback.
    3. **MockBackend**: Intercepts requests to simulate server responses for local development (enabled via `useMockBackend`).
- **Isomorphic Auth**: Combines `localStorage` (client persistence) with **Cookies** (SSR bridge) to eliminate auth-flicker and enable secure server-side guards.
- **Fetch API**: Optimized for SSR using `withFetch()` for modern, high-performance network communication.

## 5. Transactional Notification System
- **Ticket-Registry Pattern**: Implements a "Coat Check" system. Actions are registered in a `NotificationService` map before execution.
- **HttpContext Integration**: A unique `NOTIFICATION_TICKET` is passed through the HTTP pipeline, allowing the Interceptor to trigger the correct UI feedback (Toast) based on the specific request's success or failure.

## 6. Configuration & Environments
- **Token-based Injection**: Environment-specific variables are mapped to **Injection Tokens** (e.g., `API_BASE_URL`, `AUTH_CONFIG`) during bootstrap.
- **Environment Parity**: Uses Angular's modern file-replacement strategy to swap `environment.ts` (Production) with `environment.development.ts` at build time.
- **Feature Flags**: `useMockBackend` gates the mock interceptor so production builds always target real APIs.

## 7. UI, Styling & Accessibility
- **Hybrid CSS Strategy**: Combines **Tailwind CSS v4** for rapid utility-first layouting with **Angular Material 3** for accessible, enterprise-ready components.
- **Scoped Abstraction**: Complex Tailwind chains are abstracted into component-scoped `.scss` files using semantic classes, preventing "class soup" in templates.
- **OnPush Detection**: Enforced across all components to ensure predictable data flow and maximum rendering performance.

## 8. Quality Gates (Linting & Testing)
- **Strict ESLint**: Enforces project standards, including file length limits (max 600 lines) and naming conventions.
- **Vitest**: High-speed testing suite covering:
    - **Unit**: Pure logic and type-guards (e.g., `http-errors`).
    - **Integration**: Interceptor middleware and Signal-based component interactions.
- **Prettier**: Guarantees a consistent "Double Quote" code style across the entire team.

