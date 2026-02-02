import {ValueOf} from "@core/types/value-of";

export const FieldType = {
    Text: "text",
    Email: "email",
    Phone: "phone",
    Select: "select",
    Radio: "radio",
    Switch: "switch",
    Checkbox: "checkbox",
    File: "file",
} as const;

export type FieldType = ValueOf<typeof FieldType>;
export type FieldOptionValue = string | number | boolean;
export type FormFieldValue = FieldOptionValue | null;
export type FormValueMap = Record<string, FormFieldValue>;

/**
 * @description
 * Defines the responsive grid layout for a form field, mapping to Tailwind CSS breakpoints.
 */
export interface FieldGridProps {
    /** Default column span (mobile-first). Defaults to 12 if not set. */
    default?: number;
    /** Column span for small screens and up (sm:). */
    sm?: number;
    /** Column span for medium screens and up (md:). */
    md?: number;
    /** Column span for large screens and up (lg:). */
    lg?: number;
    /** Column span for extra-large screens and up (xl:). */
    xl?: number;
}

export interface FieldPermissions {
    hidden?: boolean;
    readonly?: boolean;
}

export type FieldValidatorConfig =
    | { type: "required"; message?: string }
    | { type: "min"; value: number; message?: string }
    | { type: "max"; value: number; message?: string }
    | { type: "email"; message?: string }
    | { type: "pattern"; value: string; message?: string };

export interface FieldOption {
    label: string;
    value: FieldOptionValue;
}

export interface FormFieldConfig {
    key: string;
    type: FieldType;
    label: string;
    value?: FormFieldValue;
    placeholder?: string;
    options?: FieldOption[];
    validators?: FieldValidatorConfig[];
    permissions?: FieldPermissions;
    grid?: FieldGridProps;
}

export interface FormConfig {
    id: string;
    title: string;
    description?: string;
    fields: FormFieldConfig[];
}
