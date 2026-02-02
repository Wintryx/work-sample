import {AbstractControl, FormControl, FormGroupDirective, NgForm} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {FieldValidatorConfig} from "@domains/forms";

/**
 * @description
 * Error state matcher that triggers once a control is dirty or touched.
 */
export class DirtyTouchedErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
        return !!control && control.invalid && (control.dirty || control.touched);
    }
}

/**
 * @description
 * Determines whether errors should be shown based on user interaction.
 */
export const shouldShowError = (control: AbstractControl | null): boolean =>
    !!control && control.invalid && (control.dirty || control.touched);

const findValidatorMessage = (validators: FieldValidatorConfig[], type: FieldValidatorConfig["type"]): string | undefined =>
    validators.find(v => v.type === type)?.message;

/**
 * @description
 * Resolves the best-fit error message for a control based on schema config
 * and any custom validator messages returned in the error object.
 */
export const resolveFieldErrorMessage = (
    control: AbstractControl | null,
    validators: FieldValidatorConfig[] = [],
): string | null => {
    /**
     * Note:
     * `min` in the schema is interpreted as `minLength` for text-like fields.
     * This helper therefore maps `minlength` errors back to the `min` config.
     */
    if (!control || !control.errors) return null;

    if (control.hasError("required")) {
        return findValidatorMessage(validators, "required") ?? "This field is required";
    }
    if (control.hasError("email")) {
        return findValidatorMessage(validators, "email") ?? "Please enter a valid email address";
    }
    if (control.hasError("min")) {
        const error = control.getError("min") as { min: number } | null;
        const message = findValidatorMessage(validators, "min");
        return message?.replace("{value}", String(error?.min ?? "")) ?? `Minimum value is ${error?.min ?? ""}`;
    }
    if (control.hasError("max")) {
        const error = control.getError("max") as { max: number } | null;
        const message = findValidatorMessage(validators, "max");
        return message?.replace("{value}", String(error?.max ?? "")) ?? `Maximum value is ${error?.max ?? ""}`;
    }
    if (control.hasError("minlength")) {
        const error = control.getError("minlength") as { requiredLength: number } | null;
        const message = findValidatorMessage(validators, "min");
        return message?.replace("{value}", String(error?.requiredLength ?? "")) ??
            `Minimum length is ${error?.requiredLength ?? ""}`;
    }
    if (control.hasError("pattern")) {
        return findValidatorMessage(validators, "pattern") ?? "Invalid format";
    }

    const [firstKey] = Object.keys(control.errors);
    const errorValue = control.getError(firstKey) as unknown;

    if (typeof errorValue === "string") {
        return errorValue;
    }

    if (errorValue && typeof errorValue === "object" && "message" in errorValue) {
        const message = (errorValue as { message?: unknown }).message;
        if (typeof message === "string") return message;
    }

    return "Invalid input";
};
