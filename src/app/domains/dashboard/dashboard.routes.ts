import { Routes } from "@angular/router";

export const dashboardRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@domains/dashboard").then((m) => m.DashboardPage),
  },
  {
    path: "items/:id",
    loadComponent: () =>
      import("@domains/dashboard").then((m) => m.ItemDetailPage),
  },
];
