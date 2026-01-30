# Architectural Overview

## 1. Domain-Driven Design (DDD) & Layering
To ensure scalability for a team of 2+ developers, the project follows a strict **Vertical Slicing** approach combined with specialized internal layering:

- **`core/`**: Global infrastructure singletons (Auth, HTTP, Notifications, Layout).
    - Internal layering: `data-access/` (Services/Models), `guards/`, `layout/`.
- **`domains/`**: Business-specific features. Each domain is strictly isolated and partitioned:
    - **`domain/`**: Pure logic, interfaces, and typed constants (e.g., `ItemStatus`).
    - **`application/`**: Orchestration layer using the **Facade Pattern**.
    - **`presentation/`**: UI logic, including `pages/` (smart) and `components/` (dumb).
    - **Active Domains**: `auth`, `dashboard`, and `notifications` (debug UI for success/error/unauthorized flows).
- **`shared/`**: Reusable, stateless UI building blocks (Badges, Buttons) and Pipes.

## 2. Encapsulation & Public API
- **Barrel Files**: Each module folder exposes a **Public API** via `index.ts`. External consumers are forbidden from importing internal files directly.
- **Path Aliases**: Clean imports are enforced via TypeScript aliases (e.g., `@core/*`, `@domains/*`, `@shared/*`), preventing brittle relative paths.
- **SOLID Mindset**: The architecture is intentionally aligned with SOLID principles (SRP via Facades/Services, OCP via Interceptors, DIP via DI tokens), and the current codebase already reflects these patterns.
- **Component Naming**: Use the `*.component.ts|html|scss|spec.ts` naming scheme in `presentation/pages` and `presentation/components`. Selectors follow `app-<feature>-<name>`, and specs mirror the component filename for easy discovery.

## 3. State Management (Angular Signals)
- **Signals-First**: Primary state mechanism using Angular 21 Signals for fine-grained reactivity.
- **Facade Pattern**: Components interact exclusively with Facades. This abstracts away the `HttpClient` and complex state transitions.
- **Resolver-Driven Loading**: Initial domain data is loaded via route resolvers (SSR-safe). Facades expose `ensureLoaded()` and keep `computed()` selectors side-effect free while deduplicating in-flight requests.
- **Resource Management**: Use of `takeUntilDestroyed()` ensures automatic unsubscription and prevents memory leaks.

## 4. HTTP Pipeline & Security
- **Interceptor Chain**: A strictly ordered pipeline:
    1. **Auth**: Injects JWT Bearer tokens.
    2. **Notification**: Monitors `HttpContext` for automated UI feedback.
    3. **MockBackend**: Intercepts requests to simulate server responses for the work sample across environments (enabled via `useMockBackend`).
- **Isomorphic Auth**: Combines `localStorage` (client persistence) with **Cookies** (SSR bridge) to eliminate auth-flicker and enable secure server-side guards.
- **Fetch API**: Optimized for SSR using `withFetch()` for modern, high-performance network communication.

## 5. Transactional Notification System
- **Hybrid Approach**: We use two strategies to handle user feedback, avoiding boilerplate for simple cases while supporting complex ones.
- **Context-Driven Feedback (Fast-Track)**: For standard messages, we attach a config directly to the request via `withFeedback('Saved!')` or `withFeedback({ message: 'Syncing...', type: NotificationType.Info })`. The interceptor picks this up and shows a toast automatically.
- **Ticket-Registry Pattern (Complex)**: For dynamic messages or complex error handling, actions are registered in a `NotificationService` map before execution. The resulting `Ticket ID` is passed via `HttpContext`. Tickets take strict precedence over server responses, ensuring the UI always behaves as planned.
- **Rich UI**: Notifications are rendered via a custom `ToastComponent` inside the Material Snackbar. This allows for rich content (Icons, Tailwind styling) while leveraging Material's overlay management and theming overrides for color-coding.

## 6. Configuration & Environments
- **Token-based Injection**: Environment-specific variables are mapped to **Injection Tokens** (e.g., `API_BASE_URL`, `AUTH_CONFIG`) during bootstrap.
- **Environment Parity**: Uses Angular's modern file-replacement strategy to swap `environment.ts` (Production) with `environment.development.ts` at build time.
- **Feature Flags**: `useMockBackend` keeps the mock interceptor enabled for the work sample; swap to real APIs by disabling it.
- **Debug Tooling**: The `/notifications` playground is available in all environments to validate the toast pipeline.
- **SSR vs Static Hosting**: The app is built with SSR output enabled, but the work-sample deployment uses the browser bundle only. Client-side routes are served via `index.csr.html` to keep refreshes working without a Node runtime.

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
