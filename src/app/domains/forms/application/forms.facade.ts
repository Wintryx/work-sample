import { computed, DestroyRef, inject, Injectable } from "@angular/core";
import { HttpClient, HttpContext } from "@angular/common/http"; // Import HttpContext here
import { catchError, of, tap } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { API_BASE_URL } from "@core/http/api.tokens";
import { FormConfig, FormValueMap } from "@domains/forms";
import { createLoadableSignal } from "@core/state/loadable-state";
import { normalizeApiError } from "@core/http/http-errors";
import { NotificationService, withFeedback } from "@core/notifications";

/**
 * @description
 * Facade for the Dynamic Forms domain.
 * Manages loading form configurations from the backend.
 */
@Injectable({ providedIn: "root" })
export class FormsFacade {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly baseUrl = inject(API_BASE_URL);
  private readonly notificationService = inject(NotificationService);

  private readonly _state = createLoadableSignal<FormConfig | null>(null);

  /** Public, read-only signal for the loaded form configuration. */
  readonly formConfig = computed(() => this._state().data);
  /** Public signal indicating if a form config is currently being loaded. */
  readonly isLoading = computed(() => this._state().loading);
  /** Public signal for any error that occurred during loading. */
  readonly error = computed(() => this._state().error);

  /**
   * @description
   * Loads a form configuration from the mock backend by its ID.
   * Updates the internal state with the loaded data, loading status, and errors.
   * @param formId The unique identifier of the form to load (e.g., 'user-profile').
   */
  loadFormConfig(formId: string): void {
    this._state.update((s) => ({ ...s, loading: true, error: null }));

    this.http
      .get<FormConfig>(`${this.baseUrl}/forms/${formId}`)
      .pipe(
        tap((config) => {
          this._state.update((s) => ({ ...s, data: config, loading: false, loaded: true }));
        }),
        catchError((err) => {
          const normalized = normalizeApiError(err, "Failed to load form configuration");
          this._state.update((s) => ({ ...s, error: normalized.message, loading: false }));
          this.notificationService.notifyError(normalized.message);
          return of(null); // Prevent stream from dying
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  /**
   * @description
   * Handles the form submission logic by sending the data to the mock backend.
   * Uses the `withFeedback` helper to trigger a success toast upon completion.
   * @param formId The ID of the form being submitted.
   * @param formData The raw form data, including disabled fields.
   */
  submitForm(formId: string, formData: FormValueMap): void {
    const url = `${this.baseUrl}/forms/${formId}/submit`;
    // Correctly import and use HttpContext
    const context = withFeedback("Form submitted successfully!")(new HttpContext());

    this.http
      .post(url, formData, { context })
      .pipe(
        catchError((err) => {
          const normalized = normalizeApiError(err, "Submission failed");
          this.notificationService.notifyError(normalized.message);
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
