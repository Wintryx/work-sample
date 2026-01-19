# State Management Strategy

## 1. Angular Signals (Primary)
We leverage **Angular Signals** for local and global state management to benefit from:
- Fine-grained reactivity and better performance.
- Simplified component code (no manual subscription management).
- Clean integration with `computed` values.

## 2. Facade Pattern
To decouple UI components from state complexity, we use **Facades**:
- **State Hiding**: Components don't know if data comes from a Signal, RxJS, or a Cache.
- **Abstraction**: Services handle raw data; Facades provide `computed` signals for the UI.

## 3. RxJS (Secondary)
RxJS is used strictly for **asynchronous event streams** (HTTP requests, WebSocket, search debouncing).
We subscribe and update Signals inside the Facade layer to keep the UI reactive without manual subscriptions.

## 4. Signal Ownership & Encapsulation
- Services keep writable signals private and expose read-only versions.
- Components should only read from `computed` selectors or `asReadonly()` signals.

## 5. Mutable Data Structures
- When a signal holds a mutable structure (e.g., `Map`), always clone on updates.
- This ensures change detection and keeps updates predictable.

## 6. Computed Side-Effects
- Avoid direct side-effects inside `computed()`.
- If a computed selector must trigger a fetch (e.g., self-healing state), defer the call using `setTimeout`.

## 7. Input Signals for Routing
- Use `input.required()` and `withComponentInputBinding()` for route parameters.
- Compute derived state from route input signals instead of injecting `ActivatedRoute` directly.

## 8. Time-Based Signals
- Use `DestroyRef` to clean up timers or intervals tied to Signals.
- Prevents memory leaks in long-lived layout components.

## 9. Persistent State
- Auth state is hydrated from `localStorage` on the client.
- A lightweight cookie is used as an SSR bridge to avoid auth flicker.
