import {InjectionToken, Provider, Type} from "@angular/core";
import {DashboardApi} from "./dashboard.api";

/**
 * @description Injection token for the dashboard API abstraction.
 */
export const DASHBOARD_API = new InjectionToken<DashboardApi>("DASHBOARD_API");

/**
 * @description Provides the dashboard API implementation for DI.
 */
export function provideDashboardApi(api: Type<DashboardApi>): Provider[] {
  return [{provide: DASHBOARD_API, useClass: api}];
}
