import {Routes} from '@angular/router';
import {authGuard} from '@core/auth';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  {
    path: 'dashboard',
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@domains/dashboard').then(m => m.DashboardPage)
      },
      {
        path: 'items/:id',
        loadComponent: () =>
          import('@domains/dashboard').then(m => m.ItemDetailPage)
      }
    ]
  }
];
