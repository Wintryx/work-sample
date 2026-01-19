# Planned Optimizations

## Intent
This document lists planned improvements to move the work sample toward a production-grade, senior-level architecture.

## High-priority architecture corrections
1. SSR auth guard strictness
   - Current behavior allows access when the auth cookie is missing during SSR.
   - Plan: treat missing or invalid cookie as unauthenticated and redirect to `/login`.
   - Optionally add a server-side session check to avoid false positives.

2. Mock backend isolation
   - The mock interceptor is registered globally and will mask real API calls in production.
   - Plan: only register the mock interceptor in development builds or behind a feature flag.

3. Remove side-effects from computed signals
   - The dashboard facade triggers `loadItems()` inside a computed and the page also calls `loadItems()`.
   - Plan: use an explicit load trigger (component `OnInit` or a dedicated effect) and track a `loaded` flag.

4. Fix shared-layer dependency on domain models
   - `shared/ui/status-badge` imports `ItemStatus` from the dashboard domain.
   - Plan: move the status type to a shared contract (or pass a string union) and keep shared UI domain-agnostic.

5. Avoid UI dependencies in SSR guards
   - The guard injects `AuthFacade`, which pulls in `NotificationService` and `MatSnackBar`.
   - Plan: inject a minimal, UI-free auth state service in guards to keep SSR clean and deterministic.

## Secondary refinements
- Notification registry safety: add a UUID fallback when `crypto.randomUUID` is unavailable.
- Auth persistence: keep localStorage for the demo, but note production preference for HttpOnly cookies or BFF.
- Interceptor ordering: keep the documented order, add a small test to enforce it.

## Test coverage additions
- SSR guard behavior when the auth cookie is missing or invalid.
- Mock interceptor registration in dev vs prod.
- Dashboard facade load flow to ensure a single request and predictable state.
- Notification ticket flow for success and error paths.

## Done criteria
- Protected SSR routes never render for unauthenticated users.
- Production builds do not include the mock backend.
- Dashboard data loads are triggered from a single, testable source.
- Shared UI components have no domain imports.
