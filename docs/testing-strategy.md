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
