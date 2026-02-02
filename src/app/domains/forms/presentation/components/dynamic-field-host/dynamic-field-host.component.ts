import {ChangeDetectionStrategy, Component, HostBinding, input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {FieldOptionValue, FieldType, FormFieldConfig, FormFieldValue} from "@domains/forms";
import {TextInputComponent} from "@shared/ui/forms/text-input/text-input.component";
import {SwitchComponent} from "@shared/ui/forms/switch/switch.component";
import {SelectComponent} from "@shared/ui/forms/select/select.component";
import {CheckboxComponent} from "@shared/ui/forms/checkbox/checkbox.component";
import {RadioComponent} from "@shared/ui/forms/radio/radio.component";
import {FileUploadComponent} from "@shared/ui/forms/file-upload/file-upload.component";

const GRID_CLASS_MAP = {
    default: [
        "",
        "col-span-1",
        "col-span-2",
        "col-span-3",
        "col-span-4",
        "col-span-5",
        "col-span-6",
        "col-span-7",
        "col-span-8",
        "col-span-9",
        "col-span-10",
        "col-span-11",
        "col-span-12",
    ],
    sm: [
        "",
        "sm:col-span-1",
        "sm:col-span-2",
        "sm:col-span-3",
        "sm:col-span-4",
        "sm:col-span-5",
        "sm:col-span-6",
        "sm:col-span-7",
        "sm:col-span-8",
        "sm:col-span-9",
        "sm:col-span-10",
        "sm:col-span-11",
        "sm:col-span-12",
    ],
    md: [
        "",
        "md:col-span-1",
        "md:col-span-2",
        "md:col-span-3",
        "md:col-span-4",
        "md:col-span-5",
        "md:col-span-6",
        "md:col-span-7",
        "md:col-span-8",
        "md:col-span-9",
        "md:col-span-10",
        "md:col-span-11",
        "md:col-span-12",
    ],
    lg: [
        "",
        "lg:col-span-1",
        "lg:col-span-2",
        "lg:col-span-3",
        "lg:col-span-4",
        "lg:col-span-5",
        "lg:col-span-6",
        "lg:col-span-7",
        "lg:col-span-8",
        "lg:col-span-9",
        "lg:col-span-10",
        "lg:col-span-11",
        "lg:col-span-12",
    ],
    xl: [
        "",
        "xl:col-span-1",
        "xl:col-span-2",
        "xl:col-span-3",
        "xl:col-span-4",
        "xl:col-span-5",
        "xl:col-span-6",
        "xl:col-span-7",
        "xl:col-span-8",
        "xl:col-span-9",
        "xl:col-span-10",
        "xl:col-span-11",
        "xl:col-span-12",
    ],
} as const;

/**
 * @description
 * A smart wrapper component that dynamically renders the correct form widget
 * based on the field configuration type.
 * Handles layout classes (grid columns) and readonly states.
 */
@Component({
    selector: "app-dynamic-field-host",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TextInputComponent,
        SwitchComponent,
        SelectComponent,
        CheckboxComponent,
        RadioComponent,
        FileUploadComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./dynamic-field-host.component.html",
    styleUrl: "./dynamic-field-host.component.scss"
})
export class DynamicFieldHostComponent {
    readonly field = input.required<FormFieldConfig>();
    readonly control = input.required<FormControl<FormFieldValue>>();

    protected readonly FieldType = FieldType;

    @HostBinding("class")
    protected get hostClass(): string {
        return this.gridClass();
    }

    /**
     * @description
     * Resolves the responsive Tailwind grid column class string based on configuration.
     * Example: "col-span-12 md:col-span-6"
     */
    protected gridClass(): string {
        const field = this.field();
        const grid = field.grid;
        if (!grid) return "col-span-12"; // Default to full width

        const classes = [];
        const normalizeSpan = (span?: number) => (span && span >= 1 && span <= 12 ? span : undefined);
        const pushSpan = (breakpoint: keyof typeof GRID_CLASS_MAP, span?: number) => {
            const normalized = normalizeSpan(span);
            if (!normalized) return;
            const cls = GRID_CLASS_MAP[breakpoint][normalized];
            if (cls) classes.push(cls);
        };

        const defaultSpan = normalizeSpan(grid.default) ?? 12;
        classes.push(GRID_CLASS_MAP.default[defaultSpan] ?? "col-span-12");
        pushSpan("sm", grid.sm);
        pushSpan("md", grid.md);
        pushSpan("lg", grid.lg);
        pushSpan("xl", grid.xl);

        return classes.join(" ");
    }

    /**
     * Formats the value for readonly display.
     * Handles boolean/select mapping if needed.
     */
    protected getDisplayValue(): string {
        const field = this.field();
        const val = this.control().value;
        if (val === null || val === undefined) return "-";

        // If it's a select/radio, try to find the label
        if (field.options) {
            const option = field.options.find(o => o.value === val);
            return option ? option.label : String(val);
        }

        return String(val);
    }

    protected asTextControl(): FormControl<string | null> {
        return this.control() as FormControl<string | null>;
    }

    protected asBooleanControl(): FormControl<boolean | null> {
        return this.control() as FormControl<boolean | null>;
    }

    protected asOptionControl(): FormControl<FieldOptionValue | null> {
        return this.control() as FormControl<FieldOptionValue | null>;
    }

    protected asFileControl(): FormControl<string | null> {
        return this.control() as FormControl<string | null>;
    }
}
