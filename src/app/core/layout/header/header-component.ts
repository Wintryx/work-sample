import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AuthFacade} from '@core/auth';
import {MatIcon} from '@angular/material/icon';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-header-component',
  imports: [
    MatIcon,
    RouterLink,
    RouterLinkActive,
    MatIconButton,
    MatButton
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // Senior-Tip: Using the facade to drive the UI state
  protected readonly authFacade = inject(AuthFacade);

  protected onLogout(): void {
    this.authFacade.logout();
  }
}
