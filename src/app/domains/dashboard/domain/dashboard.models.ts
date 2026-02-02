import {ValueOf} from "@core/types/value-of";

/**
 * @description
 * Progress status for Dashboard items.
 * Using a const object + union type for consistency and tree-shaking.
 */
export const ItemStatus = {
  Todo: "todo",
  InProgress: "in-progress",
  Done: "done",
} as const;

export type ItemStatus = ValueOf<typeof ItemStatus>;

/**
 * @description
 * API Response Model (DTO).
 * Matches the structure of the backend JSON.
 */
export interface DashboardItemDto {
  id: string;
  title: string;
  status: ItemStatus;
  progress: number;
}

/**
 * @description
 * Domain model used by the UI and application layer.
 */
export interface DashboardItem {
  id: string;
  title: string;
  status: ItemStatus;
  progress: number;
}
