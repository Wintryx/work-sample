import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FieldValidatorConfig } from "@domains/forms";
import { FormFieldShellComponent } from "@shared/ui/forms/form-field-shell/form-field-shell.component";

/**
 * @description
 * A reusable checkbox component wrapping Angular Material's Checkbox.
 */
@Component({
  selector: "app-checkbox",
  standalone: true,
  imports: [MatCheckboxModule, ReactiveFormsModule, FormFieldShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./checkbox.component.html",
  styleUrl: "./checkbox.component.scss",
})
export class CheckboxComponent {
  readonly control = input.required<FormControl<boolean | null>>();
  readonly label = input("");
  readonly validators = input<FieldValidatorConfig[]>([]);
}
