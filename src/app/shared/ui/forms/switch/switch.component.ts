import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { FieldValidatorConfig } from "@domains/forms";
import { FormFieldShellComponent } from "@shared/ui/forms/form-field-shell/form-field-shell.component";

/**
 * @description
 * A reusable boolean switch component wrapping Angular Material's Slide Toggle.
 * Designed to be used within Reactive Forms.
 *
 * @example
 * <app-switch [control]="myControl" label="Enable Notifications"></app-switch>
 */
@Component({
  selector: "app-switch",
  standalone: true,
  imports: [MatSlideToggleModule, ReactiveFormsModule, FormFieldShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./switch.component.html",
  styleUrl: "./switch.component.scss",
})
export class SwitchComponent {
  /**
   * The FormControl instance to bind to.
   * Must be provided by the parent.
   */
  readonly control = input.required<FormControl<boolean | null>>();

  /**
   * The label text displayed next to the switch.
   */
  readonly label = input("");
  readonly validators = input<FieldValidatorConfig[]>([]);
}
