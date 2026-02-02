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
   - Mock interceptor remains enabled for the work sample in all environments; switching to real APIs is a `useMockBackend` toggle.
12. Notification registry safety
   - Added a UUID fallback when `crypto.randomUUID` is unavailable (mobile HTTP).
13. Reduced template utility noise
   - Introduced small `wtx-*` classes via `@apply` in component-scoped SCSS for page headers, panels, cards, and auth layouts.
   - Kept the pattern scoped to shared building blocks to avoid overengineering.
14. Error normalization + notification policy
   - Added `normalizeApiError(...)` as a single source of truth for error messages and codes.
   - Clarified notification behavior: errors always show; success toasts require a ticket or explicit opt-in.

## Secondary refinements
- Auth persistence: keep localStorage for the demo, but note production preference for HttpOnly cookies or BFF.
- Interceptor ordering: keep the documented order, add a small test to enforce it.
- SOLID-oriented refinements:
  - Repository interfaces for DIP/LSP: Introduce domain repositories (e.g., `DashboardRepository`) so facades depend on abstractions and data sources can be swapped without touching UI/use-case code.
  - Query/command facade split for ISP: Separate read-only signals/queries from write actions to keep facades small and purpose-driven as the domain grows.

## Backend expansion plan (Angular + .NET, DDD-conform)
Goal: add a production-style backend while preserving the existing DDD boundaries in the frontend.

### Phase 1 - Monorepo layout
- Create a monorepo layout:
  - `apps/web` (existing Angular app)
  - `apps/api` (.NET Web API)
  - `packages/contracts` (DTOs / OpenAPI types only, no domain models)
- Keep frontend domains isolated (`domains/<feature>/{domain,application,presentation}`).
- Backend domain models live only in `apps/api/Wintryx.Domain`.

### Phase 2 - Backend DDD layering (.NET)
- Structure:
  - `Wintryx.Api` (presentation / controllers / minimal API)
  - `Wintryx.Application` (use cases, orchestration, interfaces)
  - `Wintryx.Domain` (entities, value objects, domain services)
  - `Wintryx.Infrastructure` (DB, repositories, external integrations)
- Enforce dependencies:
  - `Domain` -> no dependencies
  - `Application` -> depends on `Domain`
  - `Infrastructure` -> depends on `Application` and `Domain`
  - `Api` -> depends on `Application`

### Phase 3 - Contracts and mapping
- Define API DTOs in `packages/contracts`.
- Use explicit mapping:
  - Domain -> DTO (output)
  - DTO -> Domain command/request (input)
- Avoid sharing domain models across frontend/backed.
 - Optional (contract-first): OpenAPI as the single source of truth.
   - Generate Angular clients via `openapi-generator` (`typescript-angular`).
   - Keep generated DTOs in `packages/contracts/generated`, map them to domain models in the application layer.
   - Script snippet:
     ```json
     {
       "scripts": {
         "codegen:api": "npx openapi-generator-cli generate -i packages/contracts/openapi.yaml -g typescript-angular -o packages/contracts/generated --additional-properties=providedInRoot=true,ngVersion=21"
       }
     }
     ```

### Phase 4 - Minimal endpoints (dashboard)
- `GET /api/dashboard` returns items (DTOs)
- `GET /api/notifications/debug/error` and `/unauthorized` for parity with the work-sample notifications.
- Add basic error envelope (status, code, message) to align with `ApiError<TCode>` in frontend.

### Phase 5 - Auth strategy (simple but realistic)
- Keep mock auth in frontend for now.
- Backend supports bearer token validation (configurable) but can run in "mock" mode locally.
- Document how to switch to real IdP (Keycloak/Auth0) later.

### Phase 6 - Local dev + DB
- Optional DB (Postgres) via `docker-compose.yml` under `/infra`.
- Seed demo data for dashboard items.
- Provide `.env.example` for local dev configuration.

### Phase 7 - CI/CD
- GitHub Actions:
  - Job 1: Angular lint/test/build
  - Job 2: `dotnet build` + `dotnet test`
- Optional: publish artifacts or docker image for the API.

### Phase 8 - Hosting (cost-effective)
- Frontend: Vercel (static)
- Backend options (cheap + simple):
  - Render / Railway / Fly.io (container or .NET runtime)
  - Azure App Service (fits .NET, free tier possible)
- DB: Neon / Supabase / Railway Postgres (free tier)

### Phase 9 - Docs and demo narrative
- Document the split between frontend DDD and backend DDD.
- Provide an architecture diagram and API contract summary.
- Explain trade-offs (static hosting + external API) as a pragmatic choice for a work sample.

### Phase 10 - Senior-level polish (optional, high value)
- Add a short ADR-style note for key decisions (static hosting, mock backend in prod, contract strategy).
- Contract-first option: OpenAPI as the single source of truth, generated DTOs for frontend.
- Security basics: CORS allowlist, simple rate limits, and consistent error envelopes.
- Environment strategy: `.env.example`, documented dev/staging/prod split.
- Observability: structured logs + health endpoint for uptime checks.

## Test coverage additions
- SSR guard behavior when the auth cookie is missing or invalid.
- Mock interceptor registration when `useMockBackend` is disabled.
- Resolver-based loading and in-flight deduplication to ensure a single request and predictable state.
- Notification ticket flow for success and error paths.

## Done criteria (remaining)
