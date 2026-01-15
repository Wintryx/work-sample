import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {StatusBadgeComponent} from '@shared/ui/status-badge/status-badge';
import {DashboardItemDto} from '../../dashboard.models';

/**
 * @description
 * Pure presentational (dumb) component for the dashboard data table.
 * Receives data via inputs and notifies parent via outputs.
 */
@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressBarModule, StatusBadgeComponent],
  templateUrl: './dashboard-table.html',
  styleUrl: './dashboard-table.scss'
})
export class DashboardTableComponent {
  readonly items = input.required<DashboardItemDto[]>();
  readonly selectItem = output<string>();

  protected readonly displayedColumns = ['id', 'title', 'status', 'progress', 'actions'];
}
