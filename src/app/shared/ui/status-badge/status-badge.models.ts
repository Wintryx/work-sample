import {ValueOf} from "@core/types/value-of";

export const StatusBadgeVariant = {
  Success: "success",
  Info: "info",
  Warning: "warning",
  Neutral: "neutral",
} as const;

export type StatusBadgeVariant = ValueOf<typeof StatusBadgeVariant>;
