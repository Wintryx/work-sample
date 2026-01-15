/**
 * @description
 * Progress status for Dashboard items.
 * Using an Enum for better readability and refactoring support.
 */
export enum ItemStatus {
  Todo = 'todo',
  InProgress = 'in-progress',
  Done = 'done',
}

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
