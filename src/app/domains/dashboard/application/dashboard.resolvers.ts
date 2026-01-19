import {inject} from "@angular/core";
import {ResolveFn} from "@angular/router";
import {DashboardItem} from "@domains/dashboard/domain/dashboard.models";
import {DashboardFacade} from "./dashboard.facade";

/**
 * @description
 * Resolves the dashboard item list to support SSR-safe initial rendering.
 */
export const dashboardItemsResolver: ResolveFn<DashboardItem[]> = () => {
  return inject(DashboardFacade).ensureLoaded();
};
