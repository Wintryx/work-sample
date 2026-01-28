import {ChangeDetectionStrategy, Component, input, output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {StatusBadgeComponent} from "@shared/ui/status-badge/status-badge.component";
import {DashboardItem, ItemStatus} from "@domains/dashboard/domain/dashboard.models";
import {
    DASHBOARD_STATUS_BADGE_MAP,
    DashboardStatusBadge,
} from "@domains/dashboard/presentation/dashboard.status-badge";

/**
 * @description
 * Pure presentational (dumb) component for the dashboard data table.
 * Receives data via inputs and notifies parent via outputs.
 */
@Component({
    selector: "app-dashboard-table",
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        StatusBadgeComponent,
    ],
    templateUrl: "./dashboard-table.component.html",
    styleUrl: "./dashboard-table.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTableComponent {
    readonly items = input.required<DashboardItem[]>();
    readonly selectItem = output<string>();

    protected readonly statusBadgeMap = DASHBOARD_STATUS_BADGE_MAP;
    protected readonly displayedColumns = ["id", "title", "status", "progress", "actions"];

    /**
     * @description
     * Converts a domain status into a UI badge config in a strictly typed way.
     */
    protected statusBadgeFor(status: ItemStatus): DashboardStatusBadge {
        return this.statusBadgeMap[status];
    }
}
