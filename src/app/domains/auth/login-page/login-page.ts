import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthFacade} from '@core/auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);

  // Using a clean, reactive form group
  protected readonly loginForm = this.fb.nonNullable.group({
    username: ['Arne Winter', [Validators.required, Validators.minLength(3)]],
    password: ['password', [Validators.required]]
  });

  protected onSubmit(): void {
    if (this.loginForm.valid) {
      const {username} = this.loginForm.getRawValue();

      // Execute login via Facade
      this.authFacade.login(username);
    }
  }
}
