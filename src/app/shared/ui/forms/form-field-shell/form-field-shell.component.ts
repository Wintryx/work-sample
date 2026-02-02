import {ChangeDetectionStrategy, Component, computed, input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AbstractControl} from "@angular/forms";
import {FieldValidatorConfig} from "@domains/forms";
import {resolveFieldErrorMessage, shouldShowError} from "@shared/ui/forms/form-errors";
import {merge, switchMap, startWith} from "rxjs";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Component({
    selector: "app-form-field-shell",
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./form-field-shell.component.html",
    styleUrl: "./form-field-shell.component.scss"
})
export class FormFieldShellComponent {
    /**
     * @description
     * Form control instance used to evaluate validation state.
     */
    readonly control = input.required<AbstractControl>();
    /**
     * @description
     * Schema validators used to map error messages (optional).
     */
    readonly validators = input<FieldValidatorConfig[]>([]);
    /**
     * @description
     * When true, adds a red ring for non-material controls.
     */
    readonly decorateControl = input(false);
    /**
     * @description
     * Toggle to render the shell-level error message.
     * Use false when a nested Material field already shows `mat-error`.
     */
    readonly showErrorMessage = input(true);

    /**
     * @description
     * Signal bridge for Reactive Forms status/value changes.
     * Ensures error rendering updates immediately after user interaction.
     */
    private readonly controlChanges = toSignal(
        toObservable(this.control).pipe(
            switchMap(control =>
                merge(control.statusChanges, control.valueChanges).pipe(startWith(null)),
            ),
        ),
        {initialValue: null},
    );

    protected readonly showError = computed(() => {
        this.controlChanges();
        return shouldShowError(this.control());
    });
    protected readonly errorMessage = computed(() => {
        this.controlChanges();
        return resolveFieldErrorMessage(this.control(), this.validators());
    });
}
