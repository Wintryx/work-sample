import {Provider} from "@angular/core";
import {TestBed} from "@angular/core/testing";
import {ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {describe, expect, it, vi} from "vitest";
import {FormFactory} from "./form.factory";
import {FieldType, FormConfig} from "@domains/forms";
import {FORM_VALIDATORS} from "./validator.registry";

describe("FormFactory", () => {
    const createFactory = (providers: Provider[] = []) => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            providers: [FormFactory, ...providers],
        });
        return TestBed.inject(FormFactory);
    };

    it("should skip hidden fields and disable readonly controls", () => {
        const factory = createFactory();
        const config: FormConfig = {
            id: "test-form",
            title: "Test Form",
            fields: [
                {
                    key: "visible",
                    type: FieldType.Text,
                    label: "Visible",
                    permissions: {hidden: false, readonly: false},
                },
                {
                    key: "hidden",
                    type: FieldType.Text,
                    label: "Hidden",
                    permissions: {hidden: true, readonly: false},
                },
                {
                    key: "readonly",
                    type: FieldType.Text,
                    label: "Readonly",
                    value: "locked",
                    permissions: {hidden: false, readonly: true},
                },
            ],
        };

        const form = factory.buildForm(config);
        expect(form.contains("visible")).toBe(true);
        expect(form.contains("hidden")).toBe(false);

        const readonlyControl = form.get("readonly");
        expect(readonlyControl).toBeTruthy();
        expect(readonlyControl?.disabled).toBe(true);
    });

    it("should interpret min as minLength for text-like fields", () => {
        const factory = createFactory();
        const config: FormConfig = {
            id: "text-min-form",
            title: "Text Min",
            fields: [
                {
                    key: "username",
                    type: FieldType.Text,
                    label: "Username",
                    value: "a",
                    validators: [{type: "min", value: 2}],
                },
            ],
        };

        const form = factory.buildForm(config);
        const control = form.get("username");
        control?.updateValueAndValidity();

        expect(control?.hasError("minlength")).toBe(true);
    });

    it("should use numeric min for non-text fields", () => {
        const factory = createFactory();
        const config: FormConfig = {
            id: "select-min-form",
            title: "Select Min",
            fields: [
                {
                    key: "priority",
                    type: FieldType.Select,
                    label: "Priority",
                    value: 1,
                    options: [
                        {label: "Low", value: 1},
                        {label: "High", value: 3},
                    ],
                    validators: [{type: "min", value: 2}],
                },
            ],
        };

        const form = factory.buildForm(config);
        const control = form.get("priority");
        control?.updateValueAndValidity();

        expect(control?.hasError("min")).toBe(true);
    });

    it("should attach custom validators from the registry", () => {
        const customValidator: ValidatorFn = vi.fn(() => ({custom: true}));
        const factory = createFactory([
            {
                provide: FORM_VALIDATORS,
                useValue: {
                    formId: "custom-form",
                    validators: {
                        email: customValidator,
                    },
                },
                multi: true,
            },
        ]);

        const config: FormConfig = {
            id: "custom-form",
            title: "Custom Validators",
            fields: [
                {
                    key: "email",
                    type: FieldType.Email,
                    label: "Email",
                    value: "user@example.com",
                },
            ],
        };

        const form = factory.buildForm(config);
        const control = form.get("email");
        control?.updateValueAndValidity();

        expect(customValidator).toHaveBeenCalled();
        expect(control?.hasError("custom")).toBe(true);
    });
});
