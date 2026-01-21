# Planned Optimizations

## Intent
This document lists planned improvements to move the work sample toward a production-grade, senior-level architecture.

## High-priority architecture corrections
None at the moment.

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
8. DTO vs domain model separation
   - Introduced `DashboardItem` as a domain model and mapped from `DashboardItemDto`.
   - Reduced coupling to API response shapes.
9. Typed API error codes
   - Made `ApiError` generic (`ApiError<TCode extends string>`).
   - Added domain-specific error code unions (dashboard).
   - `TCode` is the type parameter that constrains valid error codes per domain, enabling autocomplete and safer branching.
10. Mobile-first UI pass
   - Header burger menu for `md-` breakpoints (mat-menu).
   - Mobile spacing defaults (`p-4`, `sm:p-6`) for page containers.
   - Dashboard header becomes stacked on mobile; action buttons wrap.
   - Table container gets horizontal scroll on small screens.
   - Item detail and login cards use responsive padding (`p-6` -> `sm:p-8`).
11. Mock backend isolation
   - Mock interceptor is gated by `useMockBackend` so production builds always use real APIs.
12. Notification registry safety
   - Added a UUID fallback when `crypto.randomUUID` is unavailable (mobile HTTP).

## Secondary refinements
- Auth persistence: keep localStorage for the demo, but note production preference for HttpOnly cookies or BFF.
- Interceptor ordering: keep the documented order, add a small test to enforce it.
- Reduce template utility noise:
  - Introduce a light naming pattern for reusable components (e.g., `.epm-panel`, `.epm-section-title`).
  - Use `@apply` only for shared UI building blocks to keep HTML lean without overengineering.
- SOLID-oriented refinements:
  - Repository interfaces for DIP/LSP: Introduce domain repositories (e.g., `DashboardRepository`) so facades depend on abstractions and data sources can be swapped without touching UI/use-case code.
  - Query/command facade split for ISP: Separate read-only signals/queries from write actions to keep facades small and purpose-driven as the domain grows.

## Test coverage additions
- SSR guard behavior when the auth cookie is missing or invalid.
- Mock interceptor registration in dev vs prod.
- Resolver-based loading and in-flight deduplication to ensure a single request and predictable state.
- Notification ticket flow for success and error paths.

## Done criteria (remaining)
