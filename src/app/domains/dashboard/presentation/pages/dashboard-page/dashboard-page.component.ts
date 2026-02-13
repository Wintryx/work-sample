import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Router } from "@angular/router";
import { DashboardFacade } from "@domains/dashboard/application/dashboard.facade";
import { DashboardTableComponent } from "@domains/dashboard/presentation/components/dashboard-table/dashboard-table.component";

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    DashboardTableComponent,
  ],
  templateUrl: "./dashboard-page.component.html",
  styleUrl: "./dashboard-page.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  protected readonly dashboardFacade = inject(DashboardFacade);
  private readonly router = inject(Router);

  /**
   * @description Handles the row-click interaction.
   */
  navigateToDetail(id: string): void {
    this.router.navigate(["/dashboard/items", id]);
  }
}
