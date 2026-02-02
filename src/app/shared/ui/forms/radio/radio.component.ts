import {ChangeDetectionStrategy, Component, input} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {CommonModule} from "@angular/common";
import {FieldValidatorConfig} from "@domains/forms";
import {FormFieldShellComponent} from "@shared/ui/forms/form-field-shell/form-field-shell.component";

export interface RadioOption {
    label: string;
    value: string | number | boolean;
}

/**
 * @description
 * A reusable radio group component wrapping Angular Material's Radio.
 */
@Component({
    selector: "app-radio",
    standalone: true,
    imports: [CommonModule, MatRadioModule, ReactiveFormsModule, FormFieldShellComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./radio.component.html",
    styleUrl: "./radio.component.scss"
})
export class RadioComponent {
    readonly control = input.required<FormControl<RadioOption["value"] | null>>();
    readonly label = input("");
    readonly options = input<RadioOption[]>([]);
    readonly validators = input<FieldValidatorConfig[]>([]);
}
