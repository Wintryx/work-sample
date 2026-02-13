import { inject, Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormControlState, FormGroup, Validators } from "@angular/forms";
import { FieldType, FormConfig, FormFieldConfig, FormFieldValue } from "@domains/forms";
import { FORM_VALIDATORS, FormValidatorProvider } from "./validator.registry";

@Injectable({ providedIn: "root" })
export class FormFactory {
  private readonly fb = inject(FormBuilder);
  // Inject custom validators optionally (might be null if none provided)
  private readonly customValidators = inject(FORM_VALIDATORS, { optional: true }) ?? [];

  /**
   * @description
   * Builds a reactive FormGroup based on the provided JSON configuration.
   * Merges standard JSON validators with custom injected validators.
   */
  buildForm(config: FormConfig): FormGroup<Record<string, FormControl<FormFieldValue>>> {
    const group: Record<string, FormControl<FormFieldValue>> = {};
    const formValidators = this.resolveCustomValidators(config.id);

    config.fields.forEach((field) => {
      if (field.permissions?.hidden) return;

      const validators = this.buildValidators(field, formValidators);
      const asyncValidators = this.buildAsyncValidators(field, formValidators);

      const state: FormControlState<FormFieldValue> = {
        value: field.value ?? null,
        disabled: field.permissions?.readonly ?? false,
      };

      group[field.key] = this.fb.control<FormFieldValue>(state, {
        validators,
        asyncValidators,
      });
    });

    return this.fb.group(group);
  }

  private resolveCustomValidators(formId: string): FormValidatorProvider | undefined {
    return this.customValidators.find((v) => v.formId === formId);
  }

  private buildValidators(field: FormFieldConfig, provider?: FormValidatorProvider) {
    const validators = [];

    // 1. JSON Validators
    if (field.validators) {
      for (const v of field.validators) {
        switch (v.type) {
          case "required":
            validators.push(Validators.required);
            break;
          case "min":
            /**
             * @description
             * `min` is treated as `minLength` for text-like fields to support
             * string validation with the same schema keyword.
             */
            if (
              field.type === FieldType.Text ||
              field.type === FieldType.Email ||
              field.type === FieldType.Phone
            ) {
              validators.push(Validators.minLength(v.value));
            } else {
              validators.push(Validators.min(v.value));
            }
            break;
          case "max":
            validators.push(Validators.max(v.value));
            break;
          case "email":
            validators.push(Validators.email);
            break;
          case "pattern":
            validators.push(Validators.pattern(v.value));
            break;
        }
      }
    }

    // 2. Custom Validators
    if (provider?.validators && provider.validators[field.key]) {
      const custom = provider.validators[field.key];
      if (Array.isArray(custom)) {
        validators.push(...custom);
      } else {
        validators.push(custom);
      }
    }

    return validators;
  }

  private buildAsyncValidators(field: FormFieldConfig, provider?: FormValidatorProvider) {
    const validators = [];

    if (provider?.asyncValidators && provider.asyncValidators[field.key]) {
      const custom = provider.asyncValidators[field.key];
      if (Array.isArray(custom)) {
        validators.push(...custom);
      } else {
        validators.push(custom);
      }
    }

    return validators;
  }
}
