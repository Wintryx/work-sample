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

## 5. Real Keycloak Integration (Angular 21 SSR)

This project is structured so the mock flow can be replaced by a real OIDC provider with minimal changes.

### 5.1 Dependencies
Pick one approach:
- **Recommended**: `keycloak-angular` (wraps `keycloak-js` and adds guards/interceptors)
- Alternative: `keycloak-js` directly for full control

### 5.2 Configuration
Provide Keycloak settings via environment or DI:
- `url`, `realm`, `clientId`
- `initOptions`: `onLoad: "check-sso"`, `pkceMethod: "S256"`, `checkLoginIframe: false`

### 5.3 Bootstrapping
Initialize Keycloak during app startup (e.g. `APP_INITIALIZER` or `provideKeycloak`):
- Block initial navigation until Keycloak is initialized.
- Keep `AuthFacade` as the single UI entry point.

### 5.4 AuthService Changes
- `login()` -> `keycloak.login()` (redirects to Keycloak)
- `logout()` -> `keycloak.logout()` (SSO logout)
- Replace fake token with `keycloak.token`
- Build `AuthState` from `tokenParsed` or `loadUserProfile()`
- Return `AuthResult` for errors (network, init, expired session)

### 5.5 HTTP Interceptor
Attach `Authorization: Bearer <token>` for API calls.
- Refresh token before attaching (`keycloak.updateToken(minValidity)`).

### 5.6 Guards and SSR
- Client guard: `keycloak.isLoggedIn()` or `AuthFacade.isAuthenticated()`.
- Server guard (SSR):
  - Use a server-side session or a lightweight indicator cookie (not a real auth token).
  - With Angular SSR, protected routes should use `RenderMode.Server` so the server can read the request cookie.
  - Avoid relying on `localStorage` during SSR.

### 5.7 Security Notes
- Avoid storing access tokens in `localStorage` for production.
- Prefer **memory + refresh token** or a **BFF/session cookie** model.
- If a cookie is used, make it `HttpOnly`, `SameSite=Strict`, and set by the server.

---
*Note: This architecture demonstrates a "Security-First" mindset, prioritizing robustness and developer experience (DX) for a team of multiple developers.*
