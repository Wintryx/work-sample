import { AbstractControl, ValidationErrors } from "@angular/forms";
import { FormValidatorProvider, FORM_VALIDATORS } from "./validator.registry";

/**
 * @description
 * Validates that an email contains a top-level domain (e.g., ".de", ".com").
 * This complements the permissive built-in email validator.
 */
const emailDomainValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null | undefined;
  if (!value) return null;

  const hasTld = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
  return hasTld
    ? null
    : { emailDomain: { message: "Email must include a top-level domain (e.g., .de)" } };
};

/**
 * @description
 * Validates phone numbers by enforcing allowed characters and digit length.
 * Accepts typical separators like spaces, dashes, dots, and parentheses.
 */
const phoneNumberValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null | undefined;
  if (!value) return null;

  const normalized = value.replace(/[^\d]/g, "");
  const hasValidDigits = normalized.length >= 7 && normalized.length <= 15;
  const hasValidChars = /^[0-9+\-()\s.]+$/.test(value);

  return hasValidDigits && hasValidChars
    ? null
    : { phoneNumber: { message: "Please enter a valid phone number." } };
};

/**
 * @description
 * Custom validator set for the "user-profile" form.
 */
const USER_PROFILE_VALIDATORS: FormValidatorProvider = {
  formId: "user-profile",
  validators: {
    email: emailDomainValidator,
    phone: phoneNumberValidator,
  },
};

/**
 * @description
 * Exportable provider list for app-level registration.
 */
export const FORMS_VALIDATOR_PROVIDERS = [
  { provide: FORM_VALIDATORS, useValue: USER_PROFILE_VALIDATORS, multi: true },
];
