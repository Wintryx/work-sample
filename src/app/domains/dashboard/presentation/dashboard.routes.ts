import {Routes} from "@angular/router";
import {dashboardItemsResolver} from "@domains/dashboard/application/dashboard.resolvers";

/**
 * @description
 * Parent route resolver dashboardItemsResolver triggers data loading for all dashboard sub-routes.
 * Keeps SSR refreshes stable and prevents per-page load duplication.
 */
export const dashboardRoutes: Routes = [
    {
        path: "",
        resolve: {items: dashboardItemsResolver},
        children: [
            {
                path: "",
                pathMatch: "full",
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
        ],
    },
];
