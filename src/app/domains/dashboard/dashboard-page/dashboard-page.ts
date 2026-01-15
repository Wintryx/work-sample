import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DashboardFacade} from '../dashboard.facade';
import {DashboardTableComponent} from '@domains/dashboard/components/dashboard-table/dashboard-table';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    DashboardTableComponent
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {
  protected readonly facade = inject(DashboardFacade);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.facade.loadItems();
  }

  /**
   * @description Handles the row-click interaction.
   */
  navigateToDetail(id: string): void {
    this.router.navigate(['/dashboard/items', id]);
  }
}
