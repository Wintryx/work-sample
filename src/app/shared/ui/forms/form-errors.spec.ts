import {FormControl, Validators} from "@angular/forms";
import {describe, expect, it} from "vitest";
import {resolveFieldErrorMessage} from "./form-errors";

describe("form-errors", () => {
    it("should use custom required message when provided", () => {
        const control = new FormControl("", [Validators.required]);
        control.updateValueAndValidity();

        const message = resolveFieldErrorMessage(control, [
            {type: "required", message: "Username is required."},
        ]);

        expect(message).toBe("Username is required.");
    });

    it("should map minlength errors to the min validator message", () => {
        const control = new FormControl("a", [Validators.minLength(2)]);
        control.updateValueAndValidity();

        const message = resolveFieldErrorMessage(control, [
            {type: "min", value: 2, message: "Minimum 2 characters."},
        ]);

        expect(message).toBe("Minimum 2 characters.");
    });

    it("should surface custom validator messages from error objects", () => {
        const control = new FormControl("user@localhost");
        control.setErrors({emailDomain: {message: "Email must include a top-level domain."}});

        const message = resolveFieldErrorMessage(control, []);

        expect(message).toBe("Email must include a top-level domain.");
    });

    it("should fall back to a generic message for unknown errors", () => {
        const control = new FormControl("value");
        control.setErrors({unknownError: true});

        const message = resolveFieldErrorMessage(control, []);

        expect(message).toBe("Invalid input");
    });
});
