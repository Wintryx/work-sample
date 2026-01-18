import {Observable} from "rxjs";
import {DashboardItemDto} from "@domains/dashboard";

/**
 * @description
 * Data-access contract for dashboard sources (HTTP, mock, codegen).
 */
export interface DashboardApi {
    /**
     * @description Fetches dashboard items.
     */
    loadItems(ticketId?: string | null): Observable<DashboardItemDto[]>;

    /**
     * @description Optional debug endpoint to simulate a failing request.
     */
    triggerError?(ticketId?: string | null): Observable<unknown>;
}
