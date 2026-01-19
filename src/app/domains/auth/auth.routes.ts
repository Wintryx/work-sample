import { Routes } from "@angular/router";

export const authRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("@domains/auth/login-page/login-page").then((m) => m.LoginPage),
  },
];
