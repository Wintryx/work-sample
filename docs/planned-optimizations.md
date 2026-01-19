# Planned Optimizations

## Intent
This document lists planned improvements to move the work sample toward a production-grade, senior-level architecture.

## High-priority architecture corrections
1. Mock backend isolation
   - The mock interceptor is registered globally and will mask real API calls in production.
   - Plan: only register the mock interceptor in development builds or behind a feature flag.

## Type-system refinements (planned)
1. DTO vs domain model separation
   - Introduce `DashboardItem` as a domain model and map from `DashboardItemDto`.
   - Reduces coupling to API response shapes.
2. Typed API error codes
   - Make `ApiError` generic (`ApiError<TCode extends string>`).
   - Enables domain-specific error code enums.

## Completed
1. SSR auth guard strictness
   - Missing or invalid cookies now redirect to `/login` during SSR.
   - Status: Guard-specific tests still pending.
2. Avoid UI dependencies in SSR guards
   - Guards now read auth state directly and no longer depend on UI services.
3. Resolver-driven dashboard loading
   - Initial data loads moved to route resolvers with a `loaded` flag.
   - Side-effects removed from `computed()`, with in-flight request deduplication.
4. Shared UI decoupling
   - `shared/ui/status-badge` now uses a generic UI variant enum.
   - Domain-specific status mapping lives in the dashboard presentation layer.
5. Loadable state abstraction
   - Added a generic `LoadableState<T>` to avoid repeated data/loading/loaded/error shapes.
6. Generic result type
   - Introduced `Result<T, E>` and migrated `AuthResult` to use it.
7. Enum/union consistency
   - Standardized status/error types on `as const` unions across auth, notifications, and domain models.

## Secondary refinements
- Notification registry safety: add a UUID fallback when `crypto.randomUUID` is unavailable.
- Auth persistence: keep localStorage for the demo, but note production preference for HttpOnly cookies or BFF.
- Interceptor ordering: keep the documented order, add a small test to enforce it.

## Test coverage additions
- SSR guard behavior when the auth cookie is missing or invalid.
- Mock interceptor registration in dev vs prod.
- Resolver-based loading and in-flight deduplication to ensure a single request and predictable state.
- Notification ticket flow for success and error paths.

## Done criteria (remaining)
- Production builds do not include the mock backend.
