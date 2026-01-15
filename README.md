# EPM Progress Maker

Enterprise-ready Angular 21 project demonstrating a senior-level architecture for a team of multiple developers.

## 🚀 Architectural Highlights
- **Domain-Driven Structure**: Strict boundaries between `core`, `domains`, and `shared`.
- **State Management**: Reactive data flow using **Angular Signals** and the **Facade Pattern**.
- **Modern Tooling**: Vitest for ultra-fast testing, ESLint with Accessibility rules, and Prettier.
- **Security**: Functional Guards and Interceptors for a robust Auth-Flow.

---

## 🛠️ Getting Started

### Development server
Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Key Scripts
- `npm run lint`: Execute ESLint static analysis.
- `npm run format:fix`: Automatically fix code style via Prettier.
- `npm run test`: Run unit tests using **Vitest**.
- `npm run build`: Build the project for production.

---

## 🏗️ Detailed Documentation
For deep dives into our engineering decisions, please refer to:
- [Architecture & DDD](./docs/architecture.md)
- [State Management (Signals)](./docs/state-management.md)
- [Testing Strategy](./docs/testing-strategy.md)

---

## 🧩 Standard Angular CLI Commands
<details>
<summary>Click to expand CLI reference</summary>

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Further help
To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
</details>