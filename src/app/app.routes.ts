import {Routes} from '@angular/router';
import {authGuard} from '@core/auth';

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  // Public Routes
  {
    path: 'login',
    loadComponent: () =>
      import('@domains/auth/login-page/login-page').then(m => m.LoginPage)
  },
  // Protected Routes
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
  },
  // Fallback
  {path: '**', redirectTo: 'dashboard'}
];
