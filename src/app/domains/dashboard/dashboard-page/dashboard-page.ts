import {Component, inject, OnInit} from '@angular/core';
import {DashboardFacade} from '@domains/dashboard/dashboard.facade';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage implements OnInit {
  protected readonly facade = inject(DashboardFacade);

  ngOnInit(): void {
    this.facade.loadItems();
  }
}
