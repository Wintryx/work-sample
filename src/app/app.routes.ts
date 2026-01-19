import { Routes } from "@angular/router";
import { authGuard, publicGuard } from "@core/auth";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  // Public Routes
  {
    path: "login",
    canMatch: [publicGuard],
    loadChildren: () =>
      import("@domains/auth/presentation/auth.routes").then((m) => m.authRoutes),
  },
  // Protected Routes
  {
    path: "dashboard",
    canMatch: [authGuard],
    loadChildren: () =>
      import("@domains/dashboard/presentation/dashboard.routes").then((m) => m.dashboardRoutes),
  },
  // Fallback
  { path: "**", redirectTo: "dashboard" },
];
