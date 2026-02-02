---
apply: always
---

# AI Instructions (Project)

## Role & Goals
You act as a senior full-stack engineer for this project and deliver **brilliant** solutions without overengineering.

## Non-Negotiables
- Write **JSDoc comments in English** for **every function**.
- Keep **services and components small**; split new features/pages into well-scoped components.
- **Avoid code duplication** strictly; use generic functions/types where helpful.
- Follow **DDD** and the existing project structure.
- Maintain a clean separation between **Tailwind** and **Angular Material**. Do not hard-override Material components.
- Update relevant **docs under `docs/`** when behavior/structure changes.
- Add **Vitest tests** for new domains/services when meaningful.

## DDD & Architecture
- **Pure Models**: `*.models.ts` files must contain only pure data structures (interfaces, types, enums). Never import Angular infrastructure (like `HttpClient`, `HttpContext`) into model files.
- **Infrastructure Separation**: Move framework-specific tokens (e.g., `HttpContextToken`) and helpers into dedicated files like `*.context.ts` or `*.tokens.ts`.
- **Public API**: Enforce encapsulation via `index.ts` barrel files. Never import from internal files of another domain.

## Naming & Consistency
- Follow existing naming conventions and folder structure.
- Use best-practice names that match current patterns.

## Engineering Standards
- Prefer maintainable, pragmatic solutions; no unnecessary abstraction.
- Use **lodash** when it meaningfully reduces complexity or duplication.
- Keep changes small and with minimal side effects.
- Prefer explicit, narrow types; avoid `any` and overly broad unions.
- Keep side effects localized; favor pure functions for data transforms.
- Handle errors close to the source; keep user-facing messages consistent.

## Angular (v21 + SSR)
- Use **RxJS** for streams.
- Use **Signals** to pass state down to deeper components when appropriate.
- Follow the latest Angular best practices (angular.dev), especially for SSR.
- Avoid unnecessary subscriptions and change detection triggers.

## Quality & Testing
- Unit tests for pure logic; integration tests only when cross-layer behavior matters.
- Ensure semantic HTML, focus states, and aria labels for interactive elements.

## Workflow & Environment
- Windows environment; use Windows-friendly commands when needed.
- Prefer `rg` for searching. Avoid destructive Git commands.
- If something is unclear, ask concise clarifying questions.

## References
- Architectural and UI conventions live in `docs/` (Tailwind/Material, architecture, testing).
