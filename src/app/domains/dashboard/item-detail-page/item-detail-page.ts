import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {StatusBadgeComponent} from '@shared/ui/status-badge/status-badge';
import {DashboardFacade} from '../dashboard.facade';

@Component({
  selector: 'app-item-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatCardModule, StatusBadgeComponent],
  templateUrl: './item-detail-page.html',
  styleUrl: './item-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailPage {
  private readonly dashboardFacade = inject(DashboardFacade);

  /**
   * Senior-Feature: Angular automatically binds the ':id' from the URL
   * to this input signal thanks to 'withComponentInputBinding()'.
   */
  readonly id = input.required<string>();

  /**
   * We reactively find the item in our facade state.
   */
  protected readonly item = computed(() =>
    this.dashboardFacade.items().find(i => i.id === this.id())
  );
}
