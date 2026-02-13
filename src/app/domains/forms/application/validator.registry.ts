import { InjectionToken } from "@angular/core";
import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";

/**
 * @description
 * Interface for providing custom validators for a specific form.
 */
export interface FormValidatorProvider {
  /** The ID of the form these validators belong to (matches FormConfig.id). */
  formId: string;
  /** Map of field keys to validator functions. */
  validators: Record<string, ValidatorFn | ValidatorFn[]>;
  /** Map of field keys to async validator functions. */
  asyncValidators?: Record<string, AsyncValidatorFn | AsyncValidatorFn[]>;
}

/**
 * @description
 * Multi-provider token to register custom validators.
 * Allows decoupling the generic form builder from domain-specific validation logic.
 */
export const FORM_VALIDATORS = new InjectionToken<FormValidatorProvider[]>("FORM_VALIDATORS");
