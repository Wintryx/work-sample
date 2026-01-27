# Leitfaden zur Präsentation der Arbeitsprobe

Dieses Dokument dient als roter Faden für die Vorstellung des Projekts "EPM Progress Maker". Der Fokus liegt auf der Demonstration von Senior-Kompetenzen in den Bereichen Architektur, Sicherheit und Skalierbarkeit.

---

## 1. Architektur & Struktur (Der Senior-Blick)
*   **Thema**: Warum DDD und Vertical Slicing?
*   **Punkte**:
    *   **Kapselung**: Jedes Modul (`core`, `domains`, `shared`) ist eine autarke Einheit mit eigener **Public API (`index.ts`)**. Das verhindert unkontrollierte Abhängigkeiten ("Spaghetti-Code").
    *   **Layering**: Innerhalb der Domains trennen wir strikt in `domain` (Logik), `application` (Facade) und `presentation` (UI). Das macht den Code für ein Team von 6+ Entwicklern vorhersagbar.
    *   **DIP**: Nutzung von **Injection Tokens** für API-URLs und Auth-Konfigurationen, um den Code komplett von der Umgebung zu entkoppeln.

## 2. State Management & Reaktivität
*   **Thema**: Warum Angular Signals statt klassischem RxJS/Zone.js?
*   **Punkte**:
    *   **Performance**: Feingranulare Reaktivität ohne unnötige Change Detection Zyklen.
    *   **Facade Pattern**: Die UI ist "dumm". Sämtliche Orchestrierung (Laden, Error-Handling, State-Updates) findet zentral in der Facade statt.
    *   **Resolver-Driven Loading**: Route-Resolver rufen `ensureLoaded()` auf, damit SSR/Refresh stabil sind und `computed()` side-effect free bleibt.
    *   **In-Flight Dedup**: Parallele Loads teilen sich denselben Request, um doppelte HTTP-Calls zu vermeiden.
    *   **Generische Typen & Helfer**: Gemeinsame Verträge wie `Result<T, E>` und `ApiError<TCode>` vermeiden Redundanz und machen Refactorings sicherer als die frühere Ad-hoc-Typisierung.

## 3. Isomorphe Authentifizierung (SSR Mastery)
*   **Thema**: Die Herausforderung von Server-Side Rendering in Angular 21.
*   **Punkte**:
    *   **Hydration Gap**: Erklärung, dass der Server keinen Zugriff auf den `localStorage` hat.
    *   **Die Lösung**: Eine hybride Strategie aus **Cookies** (für den Server-Guard) und **localStorage** (für den Client-State).
    *   **UX**: Verhindert den typischen "Redirect-Flicker" beim Neuladen geschützter Seiten.

## 4. Transactional Messaging (Innovation)
*   **Thema**: Wie behandeln wir Feedback bei parallelen Requests?
*   **Punkte**:
    *   **Ticket-System**: Optionales Registrieren von Nachrichten im `NotificationService` vor dem HTTP-Call, wenn ein Toast individuell gesteuert werden soll.
    *   **HttpContext**: Die Ticket-ID reist durch den Interceptor.
    *   **Automatisierung**: Der `notificationInterceptor` zeigt Fehler immer an (Default-Konfiguration), während Success-Toasts nur mit Ticket oder bewusstem Opt-in kommen. UI-Komponenten bleiben dadurch komplett frei von Messaging-Logik.
    *   **Notifications-Playground**: Eigene Seite mit Aktionen ("Simulate Error/Unauthorized"), um die Toast-Pipeline und Logout-Flow gezielt zu demonstrieren.
    *   **Error Normalization**: `normalizeApiError(...)` vereinheitlicht Message/Status/Code, sodass Fehlerflüsse konsistent und testbar bleiben.
    *   **Typed API Error Codes**: `ApiError<TCode>` + Domain-Codes ermöglichen deterministisches Error-Handling (z. B. Unauthorized -> logout + toast).

## 5. UI & Clean Code Standards
*   **Thema**: Maintainability und Developer Experience (DX).
*   **Punkte**:
    *   **Tailwind v4**: Modernste Utility-First Strategie.
    *   **Angular Material 3**: Zugriff auf barrierefreie, konsistente Enterprise-Komponenten (z. B. Buttons, Inputs, Snackbars).
    *   **Lodash Utilities**: Konsistente Helper für Daten-Transformationen, Defaults und Guards – macht Code kürzer und lesbarer.
    *   **Sass-Abstraction**: Vermeidung von "Class Soup" im HTML durch Abstraktion in scoped SCSS via `@apply`.
    *   **Hybrid Utility Pattern**: Kleine, semantische `epm-*` Klassen via `@apply` fuer wiederverwendbare Layout-Bausteine.
    *   **Strict Quality Gates**: Demonstration der ESLint-Regeln (600 Zeilen Limit, OnPush Pflicht) und automatisierte Formatierung via Prettier.

## 6. Testing Strategie
*   **Thema**: Sinnvolle Tests statt "Blind-Coverage".
*   **Punkte**:
    *   **Vitest**: Nutzung der modernsten Test-Tooling-Generation für maximale Geschwindigkeit.
    *   **Ebenen**:
        *   Unit Tests für komplexe Parser (`http-errors`).
        *   Integration Tests für Middleware (`auth.interceptor`).
        *   UI Tests für Komponenten-Kontrakte (`dashboard-table` Inputs/Outputs).

---

### Drei Sätze für den "Winning Impression":

1.  **Zur Skalierbarkeit**: *"Ich habe die Architektur so gewählt, dass die kognitive Last für neue Entwickler minimal bleibt“ jeder weiß durch die DDD-Struktur sofort, wo Code hingehört."*
2.  **Zur Technologie**: *"Wir nutzen das volle Potenzial von Angular 21, insbesondere Signal-based Inputs und Isomorphe Auth, um eine moderne, performante Web-App abzuliefern."*
3.  **Zur Robustheit**: *"Fehlerbehandlung ist bei mir kein Afterthought, sondern durch Type-Guards und transaktionale Interceptoren tief in den Core-Workflow integriert."*

