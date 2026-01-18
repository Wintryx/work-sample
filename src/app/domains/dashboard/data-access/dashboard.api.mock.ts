import {Injectable} from "@angular/core";
import {delay, Observable, of, throwError} from "rxjs";
import {DashboardItemDto} from "@domains/dashboard";
import {DashboardApi} from "./dashboard.api";
import {DASHBOARD_MOCK_DATA} from "./dashboard.mock-data";

/**
 * @description
 * Mock implementation of the DashboardApi using local in-memory data.
 */
@Injectable({providedIn: "root"})
export class DashboardApiMock implements DashboardApi {
  /**
   * @description Returns mock dashboard items with a small delay.
   */
  loadItems(): Observable<DashboardItemDto[]> {
    return of(DASHBOARD_MOCK_DATA).pipe(delay(800));
  }

  /**
   * @description Simulates a failing request for debug/testing flows.
   */
  triggerError(): Observable<unknown> {
    return throwError(() => new Error("Simulated API failure for debugging purposes.")).pipe(
      delay(500),
    );
  }
}
