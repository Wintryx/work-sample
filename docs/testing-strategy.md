# Testing Strategy

## 1. Core Objectives
To ensure high-quality delivery within a team of 2+ developers, our testing strategy focuses on **stability, speed, and maintainability**. We prioritize meaningful tests over 100% code coverage to keep the development velocity high.

## 2. Tooling: Vitest
We use **Vitest** as our primary test runner instead of Jest or Karma.
- **Speed**: Vitest leverages the same Vite-based transformation pipeline as our dev server, resulting in ultra-fast execution.
- **Modernity**: Native ESM support avoids complex transpilation issues often found in large Angular projects.
- **Developer Experience**: Highly efficient "Watch-Mode" for short feedback loops.

## 3. The Testing Pyramid

### Unit Tests (80%)
Focuses on pure logic in isolation.
- **Logic Utilities**: Verifying type-guards and data parsers (e.g., `http-errors.spec.ts`).
- **Domain Models**: Ensuring business rules and Enums behave correctly.

### Integration Tests (15%)
Validates the interaction between multiple units.
- **HTTP Middleware**: Testing Functional Interceptors using `HttpTestingController` to verify security and notification headers (e.g., `auth.interceptor.spec.ts`).
- **Smart Components**: Verifying orchestration between Facades, Router, and UI (e.g., `dashboard-page.spec.ts`).
- **Dumb Components**: Testing the "Contract" via Signal-based inputs and outputs (e.g., `dashboard-table.spec.ts`).
- **Route Resolvers**: Ensuring resolver-driven data loading behaves correctly during navigation and refresh.

### E2E Tests (5%)
Reserved for critical user journeys like the Login Flow and Dashboard navigation.

## 4. Standardized Patterns & Best Practices

### Co-Location
Following DDD principles, all `.spec.ts` files are located directly next to the source file they test. This ensures that tests are always front-of-mind during refactoring.

### Reactive State Testing (Signals)
We utilize the latest Angular 21 testing primitives:
- **`componentRef.setInput()`**: The official way to test Signal-based inputs.
- **Computed Assertions**: Verifying that UI state updates immediately when the underlying Facade signal changes.

### Dependency Inversion & Mocking
- **Facade Mocks**: We never test against real backend services. Instead, we use lightweight Signal-based mocks to decouple UI tests from infrastructure logic.
- **Spying with `vi.fn()`**: Using Vitest's native spies to verify interactions (e.g., ensuring a router navigation was triggered).

### Resource Management
Tests for asynchronous logic use `HttpTestingController` or mocked timers to ensure they remain **synchronous and deterministic**. We explicitly verify that no requests are left outstanding via `httpMock.verify()`.

## 5. Quality Gates
Testing is an integral part of our CI/CD pipeline:
1. **Linting**: `npm run lint` ensures architectural compliance.
2. **Formatting**: `npm run format:check` enforces team style standards.
3. **Unit/Integration**: `npm run test` must pass before any merge into `main`.
