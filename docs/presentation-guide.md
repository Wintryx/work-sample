# Leitfaden zur Praesentation der Arbeitsprobe

Dieses Dokument dient als roter Faden fuer die Vorstellung des Projekts "Wintryx Progress Maker". Der Fokus liegt auf der Demonstration von Senior-Kompetenzen in den Bereichen Architektur, Sicherheit und Skalierbarkeit.

---

## 1. Architektur & Struktur (Der Senior-Blick)
*   **Thema**: Warum DDD und Vertical Slicing?
*   **Punkte**:
    *   **Kapselung**: Jedes Modul (`core`, `domains`, `shared`) ist eine autarke Einheit mit eigener **Public API (`index.ts`)**. Das verhindert unkontrollierte Abhaengigkeiten ("Spaghetti-Code").
    *   **Layering**: Innerhalb der Domains trennen wir strikt in `domain` (Logik), `application` (Facade) und `presentation` (UI). Das macht den Code fuer ein Team von 6+ Entwicklern vorhersagbar.
    *   **DIP**: Nutzung von **Injection Tokens** fuer API-URLs und Auth-Konfigurationen, um den Code komplett von der Umgebung zu entkoppeln.

## 2. State Management & Reaktivitaet
*   **Thema**: Warum Angular Signals statt klassischem RxJS/Zone.js?
*   **Punkte**:
    *   **Performance**: Feingranulare Reaktivitaet ohne unnoetige Change Detection Zyklen.
    *   **Facade Pattern**: Die UI ist "dumm". Saemtliche Orchestrierung (Laden, Error-Handling, State-Updates) findet zentral in der Facade statt.
    *   **Resolver-Driven Loading**: Route-Resolver rufen `ensureLoaded()` auf, damit SSR/Refresh stabil sind und `computed()` side-effect free bleibt.
    *   **In-Flight Dedup**: Parallele Loads teilen sich denselben Request, um doppelte HTTP-Calls zu vermeiden.
    *   **Generische Typen & Helfer**: Gemeinsame Vertraege wie `Result<T, E>` und `ApiError<TCode>` vermeiden Redundanz und machen Refactorings sicherer als die fruehere Ad-hoc-Typisierung.

## 3. Isomorphe Authentifizierung (SSR Mastery)
*   **Thema**: Die Herausforderung von Server-Side Rendering in Angular 21.
*   **Punkte**:
    *   **Hydration Gap**: Erklaerung, dass der Server keinen Zugriff auf den `localStorage` hat.
    *   **Die Loesung**: Eine hybride Strategie aus **Cookies** (fuer den Server-Guard) und **localStorage** (fuer den Client-State).
    *   **UX**: Verhindert den typischen "Redirect-Flicker" beim Neuladen geschuetzter Seiten.
    *   **Deployment-Hinweis**: Fuer die Arbeitsprobe wird statisch deployed; der CSR-Fallback laeuft ueber `index.csr.html`, waehrend SSR-Build-Artefakte im Repo verbleiben.

## 4. Transactional Messaging (Innovation)
*   **Thema**: Wie behandeln wir Feedback bei parallelen Requests?
*   **Punkte**:
    *   **Ticket-System**: Optionales Registrieren von Nachrichten im `NotificationService` vor dem HTTP-Call, wenn ein Toast individuell gesteuert werden soll.
    *   **HttpContext**: Die Ticket-ID reist durch den Interceptor.
    *   **Automatisierung**: Der `notificationInterceptor` zeigt Fehler immer an (Default-Konfiguration), waehrend Success-Toasts nur mit Ticket oder bewusstem Opt-in kommen. UI-Komponenten bleiben dadurch komplett frei von Messaging-Logik.
    *   **Notifications-Playground**: Eigene Seite mit Aktionen ("Simulate Error/Unauthorized"), um die Toast-Pipeline und Logout-Flow gezielt zu demonstrieren (in allen Umgebungen verfuegbar).
    *   **Error Normalization**: `normalizeApiError(...)` vereinheitlicht Message/Status/Code, sodass Fehlerfluesse konsistent und testbar bleiben.
    *   **Typed API Error Codes**: `ApiError<TCode>` + Domain-Codes ermoeglichen deterministisches Error-Handling (z. B. Unauthorized -> logout + toast) - ergaenzt durch `AuthErrorCode` fuer Auth-spezifische Fehler.

## 5. UI & Clean Code Standards
*   **Thema**: Maintainability und Developer Experience (DX).
*   **Punkte**:
    *   **Tailwind v4**: Modernste Utility-First Strategie.
    *   **Angular Material 3**: Zugriff auf barrierefreie, konsistente Enterprise-Komponenten (z. B. Buttons, Inputs, Snackbars).
    *   **Lodash Utilities**: Konsistente Helper fuer Daten-Transformationen, Defaults und Guards - macht Code kuerzer und lesbarer.
    *   **Sass-Abstraction**: Vermeidung von "Class Soup" im HTML durch Abstraktion in scoped SCSS via `@apply`.
    *   **Hybrid Utility Pattern**: Kleine, semantische `wtx-*` Klassen via `@apply` fuer wiederverwendbare Layout-Bausteine.
    *   **Strict Quality Gates**: Demonstration der ESLint-Regeln (600 Zeilen Limit, OnPush Pflicht) und automatisierte Formatierung via Prettier.

## 6. Testing Strategie
*   **Thema**: Sinnvolle Tests statt "Blind-Coverage".
*   **Punkte**:
    *   **Vitest**: Nutzung der modernsten Test-Tooling-Generation fuer maximale Geschwindigkeit.
    *   **Ebenen**:
        *   Unit Tests fuer komplexe Parser (`http-errors`).
        *   Integration Tests fuer Middleware (`auth.interceptor`).
        *   UI Tests fuer Komponenten-Kontrakte (`dashboard-table` Inputs/Outputs).

---

### Drei Saetze fuer den "Winning Impression":

1.  **Zur Skalierbarkeit**: *"Ich habe die Architektur so gewaehlt, dass die kognitive Last fuer neue Entwickler minimal bleibt" - jeder weiss durch die DDD-Struktur sofort, wo Code hingehoert.*
2.  **Zur Technologie**: *"Wir nutzen das volle Potenzial von Angular 21, insbesondere Signal-based Inputs und Isomorphe Auth, um eine moderne, performante Web-App abzuliefern."*
3.  **Zur Robustheit**: *"Fehlerbehandlung ist bei mir kein Afterthought, sondern durch Type-Guards und transaktionale Interceptoren tief in den Core-Workflow integriert."*
