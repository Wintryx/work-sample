import {HttpClient, HttpContext} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {API_BASE_URL} from "@core/http/api.tokens";
import {NOTIFICATION_TICKET} from "@core/notifications/notification.models";
import {DashboardItemDto} from "../dashboard.models";
import {DashboardApi} from "./dashboard.api";

/**
 * @description
 * HTTP-backed implementation of the DashboardApi contract.
 */
@Injectable({providedIn: "root"})
export class DashboardApiHttp implements DashboardApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  /**
   * @description Fetches dashboard items from the REST endpoint.
   */
  loadItems(ticketId?: string | null): Observable<DashboardItemDto[]> {
    const context = new HttpContext().set(NOTIFICATION_TICKET, ticketId ?? null);
    return this.http.get<DashboardItemDto[]>(`${this.baseUrl}/dashboard/items`, {context});
  }

  /**
   * @description Triggers the debug error endpoint for testing notifications.
   */
  triggerError(ticketId?: string | null): Observable<unknown> {
    const context = new HttpContext().set(NOTIFICATION_TICKET, ticketId ?? "DEBUG_ERROR");
    return this.http.get(`${this.baseUrl}/debug/error`, {context});
  }
}
