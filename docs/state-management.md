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
RxJS is used strictly for **asynchronous event streams** (HTTP requests, WebSocket, search debouncing). We convert RxJS observables to Signals at the Facade level using `toSignal()`.
