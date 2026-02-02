import {ChangeDetectionStrategy, Component, input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {CommonModule} from "@angular/common";
import {FieldValidatorConfig} from "@domains/forms";
import {DirtyTouchedErrorStateMatcher, resolveFieldErrorMessage} from "@shared/ui/forms/form-errors";
import {FormFieldShellComponent} from "@shared/ui/forms/form-field-shell/form-field-shell.component";

export interface SelectOption {
    label: string;
    value: string | number | boolean;
}

/**
 * @description
 * A reusable dropdown component wrapping Angular Material's Select.
 */
@Component({
    selector: "app-select",
    standalone: true,
    imports: [CommonModule, MatSelectModule, MatFormFieldModule, ReactiveFormsModule, FormFieldShellComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./select.component.html",
    styleUrl: "./select.component.scss"
})
export class SelectComponent {
    readonly control = input.required<FormControl<SelectOption["value"] | null>>();
    readonly label = input("");
    readonly options = input<SelectOption[]>([]);
    readonly validators = input<FieldValidatorConfig[]>([]);

    protected readonly errorStateMatcher = new DirtyTouchedErrorStateMatcher();

    protected getErrorMessage(): string {
        return resolveFieldErrorMessage(this.control(), this.validators()) ?? "Invalid input";
    }
}
