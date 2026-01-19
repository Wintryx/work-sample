# Authentication Strategy

## 1. Overview
This module implements a robust, enterprise-grade authentication architecture. For this work sample, we utilize a **Fake OIDC Flow** that simulates real-world security protocols (State/Nonce/JWT) while being completely self-contained. The architecture is designed to be "plug-and-play" for production-ready providers like Keycloak or Auth0.

## 2. Architectural Design (DDD)
Following Domain-Driven Design principles, the authentication logic is strictly layered within `core/auth`:

- **`data-access/`**: Contains the `AuthService` (logic), `AuthInterceptor` (JWT injection), `AuthModels` (contracts), and `AuthProviders` (DI Hub).
- **`guards/`**: Logic for route protection. We use functional guards (`authGuard`, `publicGuard`) for better tree-shaking and simplicity.
  - Guards read AuthService state in the browser and rely on the SSR auth cookie on the server to prevent protected SSR rendering.
- **`AuthFacade`**: The public interface for the rest of the application. It orchestrates navigation and exposes state via read-only **Angular Signals**.

## 3. The "Isomorphic Auth" Challenge (SSR)
Angular 21 executes code on both the server and client. Since `localStorage` is unavailable during Server-Side Rendering, we implemented an **Isomorphic Persistence Bridge**:

1. **localStorage**: Stores the `AuthUser` and JWT for persistence across browser sessions.
2. **CookieService**: Sets a lightweight `epm_authenticated` cookie during login.
    - **Why?** Unlike local storage, cookies are sent to the server with every HTTP request. This allows our guards to detect the auth status during SSR, preventing "redirect loops" and "auth-flicker" during hydration.

## 4. Technical Highlights

### Discriminated Unions for Type Safety
The `AuthResult` type is based on a generic `Result<T, E>` union. This enforces that error details are only accessible when `ok` is `false`.

### OIDC Security Simulation
The `AuthService` simulates a real OIDC "Authorization Code Flow":
- **State & Nonce**: Generates unique identifiers stored in `sessionStorage` to protect against CSRF and Replay attacks.
- **JWT Construction**: Includes a utility to build structurally valid (though unsigned) JWTs, allowing for realistic testing of token-based interceptors.

### Functional Providers
The `provideAuth()` function encapsulates the entire DI setup. This keeps the global `app.config.ts` clean and allows for easy swapping of configurations between development and production environments.

## 5. Transition to Enterprise Production
To move from this work sample to a production environment, the following steps are planned:

- **Library Integration**: Replace the fake flow with `angular-oauth2-oidc` or `keycloak-js`.
- **Token Refresh**: Implement "Silent Refresh" or "Refresh Token" logic to maintain sessions without user interruption.
- **Enhanced Security**:
    - Move JWTs to `HttpOnly` / `SameSite=Strict` cookies to mitigate XSS risks.
    - Implement a **BFF (Backend-for-Frontend)** pattern if maximum security is required.
- **RBAC**: Extend the `authGuard` to handle role-based permissions (e.g., `Admin` vs. `User` views).

---
*Note: This strategy emphasizes a "Security-First" mindset and high Developer Experience (DX) within a team of multiple developers.*
