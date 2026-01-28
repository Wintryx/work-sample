import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {AuthFacade} from "@core/auth";

/**
 * @description
 * The Entry Point for User Authentication.
 *
 * Architecture Note:
 * This component acts as a pure View layer. It delegates all business logic,
 * state handling, and side effects (redirects) to the `AuthFacade`.
 */
@Component({
    selector: "app-login-page",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
    templateUrl: "./login-page.component.html",
    styleUrl: "./login-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
    private readonly fb = inject(FormBuilder);
    // Using a clean, reactive form group
    protected readonly loginForm = this.fb.nonNullable.group({
        username: ["Arne Winter", [Validators.required, Validators.minLength(3)]],
        password: ["epm", [Validators.required]],
    });
    private readonly authFacade = inject(AuthFacade);

    protected onSubmit(): void {
        if (this.loginForm.valid) {
            const {username, password} = this.loginForm.getRawValue();

            // Execute login via Facade
            this.authFacade.login(username, password);
        }
    }
}
