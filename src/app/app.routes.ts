import {Routes} from "@angular/router";
import {authGuard, publicGuard} from "@core/auth";
export const routes: Routes = [
    {path: "", pathMatch: "full", redirectTo: "dashboard"},
    // Public Routes
    {
        path: "login",
        canMatch: [publicGuard],
        loadChildren: () =>
            import("@domains/auth").then((m) => m.authRoutes),
    },
    // Protected Routes
    {
        path: "dashboard",
        canMatch: [authGuard],
        loadChildren: () =>
            import("@domains/dashboard").then((m) => m.dashboardRoutes),
    },
    {
        path: "notifications",
        canMatch: [authGuard],
        loadChildren: () =>
            import("@domains/notifications").then((m) => m.notificationsRoutes),
    },
    {
        path: "forms",
        canMatch: [authGuard],
        loadChildren: () =>
            import("@domains/forms").then((m) => m.FORMS_ROUTES),
    },
    // Fallback
    {path: "**", redirectTo: "dashboard"},
];
