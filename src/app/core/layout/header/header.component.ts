import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from "@angular/core";
import { AuthFacade } from "@core/auth";
import { MatIcon } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MatButton } from "@angular/material/button";
import { DateFormatPipe } from "@shared/pipes/date-format-pipe";

@Component({
  selector: "app-header-component",
  imports: [MatIcon, RouterLink, RouterLinkActive, MatButton, DateFormatPipe],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  // Using the facade to drive the UI state
  protected readonly authFacade = inject(AuthFacade);
  protected readonly currentTime = signal(new Date());
  private readonly timer = setInterval(() => this.currentTime.set(new Date()), 1000 * 60); // Update every minute

  constructor() {
    // Cleanup timer to prevent memory leaks
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected onLogout(): void {
    this.authFacade.logout();
  }
}
