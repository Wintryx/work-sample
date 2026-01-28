import {Routes} from "@angular/router";

export const notificationsRoutes: Routes = [
    {
        path: "",
        loadComponent: () =>
            import(
                "@domains/notifications/presentation/pages/notifications-page/notifications-page.component"
            ).then((m) => m.NotificationsPageComponent),
    },
];
