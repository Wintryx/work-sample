# Authentication Strategy

## 1. Overview
This module implements a robust, enterprise-grade authentication architecture. Although the current implementation uses a mock provider for the work sample, the underlying structure is designed to be "plug-and-play" for OIDC providers like Keycloak or Azure AD.

## 2. Architectural Design (DDD)
The authentication module is organized into distinct layers to ensure a clean separation of concerns:

- **Data-Access Layer**: Contains the `AuthService` (infrastructure logic), `AuthInterceptor` (JWT injection), and `AuthModels` (contracts).
- **Facade Layer**: The `AuthFacade` acts as the single entry point for UI components. It encapsulates state management (Angular Signals) and orchestrates navigation workflows.
- **Security Layer (Guards)**: Implements functional guards (`authGuard`, `publicGuard`) to protect routes and manage user redirection.

## 3. The "Isomorphic Auth" Challenge (SSR)
Since this project uses **Angular SSR**, we face the "Hydration Gap": the server renders the page before the browser can access `localStorage`.

### Solution: The Dual-Persistence Bridge
To ensure a seamless UX and prevent "Auth-Flicker", we implemented a hybrid strategy:
1. **localStorage**: Stores the rich user profile and session data for fast, client-side access.
2. **Cookies**: A lightweight secure cookie (`epm_authenticated`) is set during login.
  - **Why?** Cookies are sent to the server with every request. This allows our Server-Side Guards to detect the auth status immediately, ensuring the server-rendered HTML matches the authenticated state.

## 4. Technical Highlights
- **Discriminated Unions**: We use a strict `AuthResult` type. This ensures that the `AuthFacade` can only access the error `message` if the `success` flag is `false`, preventing runtime null-pointer exceptions.
- **Functional Providers**: The `provideAuth()` function in `auth.providers.ts` centralizes dependency injection, making the global `app.config.ts` highly maintainable.
- **Reactive State**: User data is exposed via read-only **Signals**, allowing for fine-grained reactivity in the Header and other UI elements without manual subscription management.

## 5. Transition to Enterprise Production
To move from this work sample to a production-ready enterprise product, the following steps are required:

### OIDC Integration
Replace the mock logic in `AuthService` with a library like `angular-oauth2-oidc`. The `AUTH_CONFIG` token is already prepared to receive real discovery URLs, client IDs, and scopes.

### Advanced Security
- **Token Refresh**: Implement silent refresh cycles to keep the user logged in without re-authentication.
- **CSRF Protection**: Implement XSRF-TOKEN header validation (standard in most Java/Spring or .NET backends).
- **HttpOnly Cookies**: For maximum security, move the JWT itself into a `SameSite=Strict; HttpOnly` cookie to mitigate XSS risks.

### Role-Based Access Control (RBAC)
Extend the `AuthUser` model and `authGuard` to support permission-based routing (e.g., `canMatch: [authGuard], data: { roles: ['ADMIN'] }`).

---
*Note: This architecture demonstrates a "Security-First" mindset, prioritizing robustness and developer experience (DX) for a team of multiple developers.*
