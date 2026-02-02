# Dynamic Forms Strategy

## 1. Overview
The Dynamic Forms module allows rendering complex, metadata-driven forms based on backend configurations. This approach decouples the UI from business logic, enabling the backend to dictate form structure, validation rules, and layout without frontend code changes.

## 2. Architecture (DDD)

### Domain Layer (`domains/forms/domain`)
Defines the schema contracts.
- **`FormConfig`**: The root object containing metadata (ID, title) and the list of fields.
- **`FieldConfig`**: Describes a single form control (type, label, validators, layout).
- **`FieldType`**: Supported control types (`text`, `email`, `phone`, `select`, `radio`, `switch`, `checkbox`, `file`).

### Application Layer (`domains/forms/application`)
Handles the transformation from JSON schema to Angular `FormGroup`.
- **`FormFactory`**: A service that parses `FormConfig` and builds a `FormGroup`.
- **`ValidatorRegistry`**: A DI-based mechanism to inject custom client-side validators (sync/async) and bind them to specific fields by key.

### Presentation Layer (`domains/forms/presentation`)
Renders the UI.
- **`DynamicFormComponent`**: The smart container. Handles data loading, form submission, and layout (Grid).
- **`DynamicFieldHost`**: A wrapper component that resolves the correct widget (Input, Select, etc.) based on `FieldType`.
- **`Widgets`**: Dumb components for specific inputs (e.g., `TextInputComponent`, `FileUploadComponent`).

### Public API (Barrel)
Consumers should import form models from the `@domains/forms` barrel to avoid deep imports.
This barrel also exports `FORMS_VALIDATOR_PROVIDERS` so app-level registration stays consistent.

## 3. Key Concepts

### Metadata-Driven UI
The frontend does not hardcode form fields. It renders whatever the backend sends.
- **Layout**: Controlled via `grid` properties in the schema (e.g., `default: 12`, `md: 6`).
- **Visibility**: Controlled via `hidden` flags.

### Readonly vs. Disabled
- **Readonly (Output)**: Fields marked as `readonly` in the schema are rendered as disabled controls but are **included** in the submission payload (using `form.getRawValue()`). Visually, they appear "grayed out" or as static text, depending on the widget.

### Custom Validation (DI Pattern)
Standard validators (required, min/max, pattern) are defined in the JSON schema.
Complex, domain-specific validators are injected via an `InjectionToken`.
- The `FormFactory` looks up validators matching the `formId` and `fieldKey` during form construction.
- This keeps the core form logic generic while allowing specific business rules to be plugged in.
- Custom validators are registered in `forms.validators.ts` and provided in `app.config.ts`.

**Example (custom validator + registration):**

```ts
// forms.validators.ts
const emailDomainValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string | null | undefined;
  if (!value) return null;
  return /@.+\.[A-Za-z]{2,}$/.test(value)
    ? null
    : { emailDomain: { message: "Email must include a top-level domain." } };
};

const USER_PROFILE_VALIDATORS: FormValidatorProvider = {
  formId: "user-profile",
  validators: { email: emailDomainValidator },
};

export const FORMS_VALIDATOR_PROVIDERS = [
  { provide: FORM_VALIDATORS, useValue: USER_PROFILE_VALIDATORS, multi: true },
];
```

```ts
// app.config.ts
providers: [
  ...FORMS_VALIDATOR_PROVIDERS,
]
```

**How errors surface in the UI:**  
Custom validators should return an error object containing a `message`.  
The `FormFieldShell` reads this message and displays it once the field is dirty/touched.

### Validation Behavior
- **`min` is interpreted as `minLength`** for text/email/phone fields, and as numeric `min` for number-like fields.
- Errors are shown only after user interaction (`dirty` or `touched`).
- Material inputs use `mat-error` with `subscriptSizing="fixed"` to avoid layout shifts.
- Non-material controls render errors via `FormFieldShell` with a red ring and reserved error space.

### Signals-First Components
All form widgets and containers use signal-based inputs/outputs (`input()` / `output()`), keeping the UI fully reactive.

### Testing Notes
- **FormFactory**: Validates schema-to-validator mapping (especially `min` -> `minLength` for text-like fields).
- **Custom Validators**: Ensures email/phone validators return messages that surface in the UI.
- **Validation UX**: Errors appear only after `dirty`/`touched`; Material inputs use `mat-error`, non-material controls use the shell.

### File Uploads
- **Immediate Upload**: Files are uploaded immediately upon selection via a dedicated endpoint.
- **Reference Storage**: The form control stores the returned `FileID` list (and metadata), not the binary data.
- **Submission**: When the form is submitted, only the file IDs are sent.
- **Multi-Image Support**: File fields can enable `multiple` and restrict `accept` (e.g., `image/*`) to allow batch image uploads.

## 4. JSON Schema Example

```json
{
  "id": "user-profile",
  "title": "Edit Profile",
  "fields": [
    {
      "key": "username",
      "type": "text",
      "label": "Username",
      "grid": { "default": 12, "md": 6 },
      "validators": [
        { "type": "required" },
        { "type": "min", "value": 2, "message": "Username must be at least 2 characters." }
      ]
    },
    {
      "key": "email",
      "type": "email",
      "label": "Email Address",
      "grid": { "default": 12, "md": 6 },
      "validators": [{ "type": "required" }, { "type": "email" }]
    },
    {
      "key": "avatar",
      "type": "file",
      "label": "Profile Picture",
      "accept": "image/*",
      "multiple": true,
      "grid": { "default": 12 }
    }
  ]
}
```
