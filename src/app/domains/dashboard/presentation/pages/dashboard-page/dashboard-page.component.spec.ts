import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardItem, DashboardPageComponent } from "@domains/dashboard";
import { DashboardFacade } from "@domains/dashboard/application/dashboard.facade";
import { signal } from "@angular/core";

/**
 * @description
 * Integration tests for the DashboardPage (Smart Component).
 * Aligned with the Ticket-based notification system.
 */
describe("DashboardPage", () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let router: Router;

  // Fix: Explicitly type the mock signals to avoid TS2345
  const facadeMock = {
    items: signal<DashboardItem[]>([]),
    isLoading: signal<boolean>(false),
    error: signal<string | null>(null),
    hasItems: signal<boolean>(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [
        { provide: DashboardFacade, useValue: facadeMock },
        {
          provide: Router,
          useValue: { navigate: vi.fn() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it("should delegate navigation to the router when an item is selected", () => {
    const testId = "p-101";

    component.navigateToDetail(testId);

    expect(router.navigate).toHaveBeenCalledWith(["/dashboard/items", testId]);
  });

  it("should render the error banner if the facade reports an error state", () => {
    // 1. Arrange: Use the correctly typed signal mock
    facadeMock.error.set("API Connection Failed");
    fixture.detectChanges();

    // 2. Assert: Verify template reflection
    const errorBanner = fixture.nativeElement.querySelector(".bg-red-50");
    expect(errorBanner).toBeTruthy();
    expect(errorBanner.textContent).toContain("API Connection Failed");
  });
});
