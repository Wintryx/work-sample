# Architectural Overview

## 1. Domain-Driven Structure
To support a team of 6 developers and ensure scalability, we follow a **Domain-Driven Design (DDD)** approach within the Angular workspace.

- **`core/`**: Global, singleton infrastructure (Auth, HTTP, Global Error Handling).
- **`domains/`**: Business-specific features. Each domain is self-contained.
- **`shared/`**: Reusable UI components, pipes, and directives without business logic.

## 2. Encapsulation (Public API)
Each module/folder uses an `index.ts` (Barrel file) to define its **Public API**.
- Internal implementation details (like `AuthService`) are hidden.
- External modules only import from the barrel file via **Path Aliases** (e.g., `@core/auth`).

## 3. Communication
- **Cross-Domain**: Communication between domains happens strictly via services or global signals.
- **Data Flow**: Unidirectional data flow using the **Facade Pattern**.
