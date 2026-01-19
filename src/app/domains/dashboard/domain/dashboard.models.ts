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

export type ItemStatus = (typeof ItemStatus)[keyof typeof ItemStatus];

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
