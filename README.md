# Wintryx Progress Maker

Enterprise-ready Angular 21 work sample showcasing a higher-level architecture with clear layering, typed contracts, and SSR-aware state handling.

## Architectural Highlights
- **DDD Layering**: Clear separation between `core`, `domains`, and `shared` with strict public APIs.
- **Signals + Facades**: Reactive state via Angular Signals, orchestration via facades, SSR-safe resolver loading.
- **Typed Contracts**: `Result<T, E>` and typed API error codes for explicit success/error flows.
- **Error Normalization**: `normalizeApiError(...)` ensures consistent message/status/code handling.
- **HTTP Pipeline**: Auth + Notification interceptors, mock backend controlled by `useMockBackend` (enabled for the work sample).
- **Notification Policy**: Errors always show with defaults; success toasts are ticket-driven (or explicitly opted-in).
- **Notifications Playground**: Dedicated route to simulate error/unauthorized/success flows and validate interceptor behavior.
- **Dynamic Forms**: Metadata-driven forms with schema validators and DI-based custom validators.
- **Utility Helpers**: Lodash for concise, readable transformations and safe defaults.
- **SSR & Hydration**: Cookie-based auth bridge and client hydration support. Static hosting uses the CSR fallback (`index.csr.html`).
- **UI Stack**: Tailwind CSS v4 for layout and Angular Material 3 for controls.
- **Quality Gates**: ESLint + Prettier, tests via `npm run test`.

---

## Getting Started

### Development server
Run `npm run start` and open `http://localhost:4200/`.

### Environment selection
- **Development (default):** `ng serve` uses `environment.development.ts`.
- **Production build/serve:** `ng serve --configuration production` (uses `environment.ts`).

### Mock backend switch
Use `useMockBackend` in the environment files to control whether the mock interceptor is active. It is enabled in both environments for the work sample.

### Key Scripts
- `npm run start` - start dev server
- `npm run lint` - run ESLint
- `npm run format:fix` - format with Prettier
- `npm run test` - run tests
- `npm run build` - production build

---

## Conventions
- **Component naming:** `*.component.ts|html|scss|spec.ts`
- **Selectors:** `app-<feature>-<name>`
- **Docs:** architecture and decisions live in `docs/`

---

## Documentation
- [Architecture & DDD](./docs/architecture.md)
- [State Management](./docs/state-management.md)
- [Authentication Strategy](./docs/authentication-strategy.md)
- [Testing Strategy](./docs/testing-strategy.md)
- [Dynamic Forms](./docs/dynamic-forms.md)
- [Planned Optimizations](./docs/planned-optimizations.md)
- [Presentation Guide](./docs/presentation-guide.md)

---

## Angular CLI Reference
<details>
<summary>Click to expand CLI reference</summary>

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help
To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
</details>

