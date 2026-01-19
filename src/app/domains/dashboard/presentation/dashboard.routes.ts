import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import(
        "@domains/dashboard/presentation/pages/dashboard-page/dashboard-page"
      ).then((m) => m.DashboardPage),
  },
  {
    path: "items/:id",
    loadComponent: () =>
      import(
        "@domains/dashboard/presentation/pages/item-detail-page/item-detail-page"
      ).then((m) => m.ItemDetailPage),
  },
];
