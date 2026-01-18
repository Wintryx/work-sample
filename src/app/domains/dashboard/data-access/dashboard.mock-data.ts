import {DashboardItemDto, ItemStatus} from "@domains/dashboard/dashboard.models";

/**
 * @description
 * Centralized mock dataset used by mock API and interceptor.
 */
export const DASHBOARD_MOCK_DATA: DashboardItemDto[] = [
  {id: "1", title: "Feature: Login Logic", status: ItemStatus.Done, progress: 100},
  {id: "2", title: "Feature: Dashboard Table", status: ItemStatus.InProgress, progress: 45},
  {id: "3", title: "Feature: Unit Tests", status: ItemStatus.Todo, progress: 0},
];
