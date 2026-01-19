# Testing Strategy

## 1. Tooling: Vitest
We use **Vitest** as the primary test runner instead of Jest/Karma.
- **Speed**: Extremely fast execution using the Vite-based application builder.
- **Modernity**: Native ESM support and simplified configuration.

## 2. The Testing Pyramid
- **Unit Tests (80%)**: Testing logic in isolation (Mappers, Facades, Guards).
- **Integration Tests (15%)**: Testing component interactions and routing.
- **E2E Tests (5%)**: Verifying critical user journeys (e.g., Login Flow).

## 3. Guidelines
- Use `HttpTestingController` for interceptor/api tests.
- Avoid mocking everything; prefer testing real logic when possible.
- Enforce `OnPush` verification in component tests.

## 4. Standalone Components & Router
- Prefer `imports: [Component]` for standalone components.
- Use `provideRouter([])` when templates use `routerLink` or `router-outlet`.

## 5. DI Tokens & Facade Mocks
- Provide required DI tokens explicitly (e.g. `AUTH_CONFIG`) in unit tests.
- Mock facades when testing shell components to avoid deep dependency chains.

## 6. Signals & Input Signals
- Update Signals directly and call `fixture.detectChanges()` to render.
- Use `fixture.componentRef.setInput()` for `input()` bindings.

## 7. Storage-Backed Auth Tests
- Set `localStorage` before service instantiation when testing `hydrate()`.
- Clear `localStorage`/`sessionStorage` in `beforeEach` to avoid leakage.

## 8. Timers and Intervals
- Components using timers should be destroyed or tested with fake timers.
- Avoid leaking intervals across test runs.

## 9. DOM Querying
- Prefer semantic queries (text/role) over class selectors.
- Use class selectors only when the class is part of the UI contract.
