import { ChangeDetectionStrategy, Component, computed, inject, input, output } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormConfig, FormFieldValue, FormValueMap } from "@domains/forms";
import { FormFactory } from "../../../application/form.factory";
import { DynamicFieldHostComponent } from "../dynamic-field-host/dynamic-field-host.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

/**
 * @description
 * The main container for rendering a metadata-driven form.
 * Takes a configuration object and builds the reactive form group.
 */
@Component({
  selector: "app-dynamic-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DynamicFieldHostComponent,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dynamic-form.component.html",
  styleUrl: "./dynamic-form.component.scss",
})
export class DynamicFormComponent {
  readonly formConfig = input.required<FormConfig>();
  readonly formSubmit = output<FormValueMap>();
  private readonly factory = inject(FormFactory);
  protected readonly formGroup = computed<FormGroup<Record<string, FormControl<FormFieldValue>>>>(
    () => this.factory.buildForm(this.formConfig()),
  );

  protected getControl(key: string): FormControl<FormFieldValue> {
    return this.formGroup().get(key) as FormControl<FormFieldValue>;
  }

  protected onSubmit(): void {
    const formGroup = this.formGroup();
    if (formGroup.valid) {
      // Use getRawValue() to include disabled (readonly) fields in the payload
      this.formSubmit.emit(formGroup.getRawValue());
    }
  }
}
