import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { CommonModule } from "@angular/common";
import { FieldValidatorConfig } from "@domains/forms";
import { resolveFieldErrorMessage } from "@shared/ui/forms/form-errors";
import { DirtyTouchedErrorStateMatcher } from "@shared/ui/forms/form-errors";
import { FormFieldShellComponent } from "@shared/ui/forms/form-field-shell/form-field-shell.component";

/**
 * @description
 * A reusable text input component wrapping Angular Material's Input.
 * Supports standard text, email, and phone types.
 */
@Component({
  selector: "app-text-input",
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormFieldShellComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./text-input.component.html",
  styleUrl: "./text-input.component.scss",
})
export class TextInputComponent {
  /** The FormControl instance to bind to. */
  readonly control = input.required<FormControl<string | null>>();

  /** The label displayed above the input. */
  readonly label = input("");

  /** Placeholder text. */
  readonly placeholder = input("");

  /** HTML input type (text, email, tel, etc.). Default: 'text'. */
  readonly type = input<"text" | "email" | "tel">("text");

  /** Validator configurations from the form schema. */
  readonly validators = input<FieldValidatorConfig[]>([]);

  protected readonly errorStateMatcher = new DirtyTouchedErrorStateMatcher();

  protected getErrorMessage(): string {
    return resolveFieldErrorMessage(this.control(), this.validators()) ?? "Invalid input";
  }
}
