import { ItemStatus } from "@domains/dashboard/domain/dashboard.models";
import { StatusBadgeVariant } from "@shared/ui/status-badge/status-badge.models";

export interface DashboardStatusBadge {
  variant: StatusBadgeVariant;
  label: string;
}

/**
 * @description
 * Domain-specific mapping from dashboard item status to shared UI badge styling.
 */
export const DASHBOARD_STATUS_BADGE_MAP: Record<ItemStatus, DashboardStatusBadge> = {
  [ItemStatus.Done]: {
    variant: StatusBadgeVariant.Success,
    label: "Done",
  },
  [ItemStatus.InProgress]: {
    variant: StatusBadgeVariant.Info,
    label: "In Progress",
  },
  [ItemStatus.Todo]: {
    variant: StatusBadgeVariant.Neutral,
    label: "Todo",
  },
};
