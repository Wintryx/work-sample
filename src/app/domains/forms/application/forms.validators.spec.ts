import {FormControl} from "@angular/forms";
import {describe, expect, it} from "vitest";
import {FORMS_VALIDATOR_PROVIDERS} from "./forms.validators";
import type {FormValidatorProvider} from "./validator.registry";

describe("forms.validators", () => {
    const provider = FORMS_VALIDATOR_PROVIDERS[0].useValue as FormValidatorProvider;

    it("should reject emails without a top-level domain", () => {
        const validator = provider.validators["email"];
        const control = new FormControl("user@localhost");

        const result = Array.isArray(validator)
            ? validator[0](control)
            : validator(control);

        expect(result).toEqual({
            emailDomain: {message: "Email must include a top-level domain (e.g., .de)"},
        });
    });

    it("should accept emails with a top-level domain", () => {
        const validator = provider.validators["email"];
        const control = new FormControl("user@example.com");

        const result = Array.isArray(validator)
            ? validator[0](control)
            : validator(control);

        expect(result).toBeNull();
    });

    it("should reject invalid phone numbers", () => {
        const validator = provider.validators["phone"];
        const control = new FormControl("abc");

        const result = Array.isArray(validator)
            ? validator[0](control)
            : validator(control);

        expect(result).toEqual({
            phoneNumber: {message: "Please enter a valid phone number."},
        });
    });

    it("should accept valid phone numbers", () => {
        const validator = provider.validators["phone"];
        const control = new FormControl("+1 234 567 890");

        const result = Array.isArray(validator)
            ? validator[0](control)
            : validator(control);

        expect(result).toBeNull();
    });
});
