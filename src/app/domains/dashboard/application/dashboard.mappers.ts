import {DashboardItem, DashboardItemDto} from "@domains/dashboard/domain/dashboard.models";

/**
 * @description
 * Maps API DTOs to domain models to decouple the UI from transport shapes.
 */
export function toDashboardItem(dto: DashboardItemDto): DashboardItem {
  return {
    id: dto.id,
    title: dto.title,
    status: dto.status,
    progress: dto.progress,
  };
}

/**
 * @description
 * Maps a list of DTOs to domain models.
 */
export function toDashboardItems(dtos: DashboardItemDto[]): DashboardItem[] {
  return dtos.map(toDashboardItem);
}
