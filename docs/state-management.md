# State Management Strategy

## 1. Core Philosophy: Reactive & Encapsulated
To support a team of 2+ developers, we follow a **Signals-first** approach combined with the **Facade Pattern**. This ensures a unidirectional data flow and strict encapsulation of business logic.

## 2. Angular Signals (Primary State)
We leverage **Angular 21 Signals** as our primary state mechanism to achieve:
- **Fine-grained Reactivity**: Only the parts of the UI that depend on a specific Signal are re-rendered.
- **Improved Performance**: Minimal change detection cycles compared to traditional `zone.js` checks.
- **Subscription-Free UI**: Components consume state via `computed()` selectors, eliminating the need for manual `async` pipes or `unsubscribe` logic.

## 3. The Facade Pattern (Application Layer)
To decouple the Presentation Layer from state complexity, every domain (e.g., `Dashboard`, `Auth`) uses a **Facade**:
- **Encapsulation**: Writable signals (`_state`) are kept private. Components only access read-only computed signals.
- **Orchestration**: Facades coordinate between the `HttpClient` and the local state.
- **Resolver-Driven Loading**: Initial data loads happen through route resolvers calling Facade `ensureLoaded()` methods. This keeps `computed()` selectors pure while remaining SSR-safe.

## 4. RxJS Integration (Asynchronous Streams)
RxJS remains the standard for **asynchronous event streams**. We follow a "Stream-to-Signal" pattern:
- **Fetch & Convert**: Data is fetched via RxJS Observables. Within the Facade, we subscribe to these streams and update our Signals in the `next` block.
- **Resource Safety**: We use the `takeUntilDestroyed()` operator combined with `inject(DestroyRef)` to ensure all streams are closed when the consuming context is destroyed, preventing memory leaks.

## 5. Advanced State Patterns used in this Project

### Transactional Registry (Ticket-System)
For global notifications, we use a **Reactive Map within a Signal**.
- Actions are registered with a unique `Ticket ID`.
- This prevents race conditions in complex UIs where multiple asynchronous operations occur simultaneously.
 - Errors can always fall back to the global default configuration even without a ticket.
 - Success toasts are ticket-driven by design (unless explicitly opted-in).

### Signal-based Routing Inputs
We utilize Angular's modern `withComponentInputBinding()` feature.
- Route parameters (like `:id`) are injected directly into components as **Signal Inputs** (`input.required()`).
- This allows the UI to derive state reactively: `item = computed(() => facade.items().find(i => i.id === id()))`.

### In-Flight Request Deduplication
To avoid parallel HTTP calls when multiple consumers trigger the same load:
- Facades cache the in-flight Observable and reuse it for concurrent requests.
- This keeps state transitions deterministic and reduces network noise.

### Isomorphic State (SSR Synchronization)
To handle the "Hydration Gap" in SSR:
- The **Auth State** is synchronized between the Server and Client using a combination of **Cookies** (visible to the server) and **localStorage** (client-side persistence).

## 6. Coding Standards
- **Immutability**: When updating Signals that hold objects or arrays, we always create new references (using the spread operator or new Map instances) to ensure proper change detection.
- **Side-Effect Management**: We avoid placing side-effects inside `computed()` signals. Automated data loads are triggered by resolvers or explicit Facade methods.
