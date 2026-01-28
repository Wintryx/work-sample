import {ChangeDetectionStrategy, Component, computed, inject, input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {StatusBadgeComponent} from "@shared/ui/status-badge/status-badge.component";
import {DashboardFacade} from "@domains/dashboard/application/dashboard.facade";
import {DASHBOARD_STATUS_BADGE_MAP} from "@domains/dashboard/presentation/dashboard.status-badge";

@Component({
    selector: "app-item-detail-page",
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        StatusBadgeComponent,
    ],
    templateUrl: "./item-detail-page.component.html",
    styleUrl: "./item-detail-page.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemDetailPageComponent {
    /**
     * Feature: Angular automatically binds the ':id' from the URL
     * to this input signal thanks to 'withComponentInputBinding()'.
     * Alternatively, we can pass the id or the item via Inputs
     */
    readonly id = input.required<string>();
    protected readonly statusBadgeMap = DASHBOARD_STATUS_BADGE_MAP;
    private readonly dashboardFacade = inject(DashboardFacade);
    /**
     * We reactively find the item in our facade state.
     */
    protected readonly item = computed(() =>
        this.dashboardFacade.items().find((i) => i.id === this.id()),
    );
}
