import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthFacade} from '@core/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  // Senior-Tip: Using a clean, reactive form group
  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['Arne Winter', [Validators.required, Validators.minLength(3)]],
    password: ['password', [Validators.required]]
  });

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      const {username} = this.loginForm.getRawValue();

      // Execute login via Facade
      this.authFacade.login(username);

      // Redirect to dashboard after successful state change
      this.router.navigate(['/dashboard']);
    }
  }
}
