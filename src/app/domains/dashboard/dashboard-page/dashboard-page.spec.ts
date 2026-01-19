import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Router} from "@angular/router";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {DashboardPage} from "./dashboard-page";
import {DashboardFacade} from "../dashboard.facade";
import {signal} from "@angular/core";
import {DashboardItemDto} from "@domains/dashboard";

/**
 * @description
 * Integration tests for the DashboardPage (Smart Component).
 * Aligned with the Ticket-based notification system.
 */
describe("DashboardPage", () => {
    let component: DashboardPage;
    let fixture: ComponentFixture<DashboardPage>;
    let router: Router;

    // Fix: Explicitly type the mock signals to avoid TS2345
    const facadeMock = {
        loadItems: vi.fn(),
        items: signal<DashboardItemDto[]>([]),
        isLoading: signal<boolean>(false),
        error: signal<string | null>(null),
        hasItems: signal<boolean>(false)
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardPage],
            providers: [
                {provide: DashboardFacade, useValue: facadeMock},
                {
                    provide: Router,
                    useValue: {navigate: vi.fn()}
                }
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardPage);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);

        fixture.detectChanges();
    });

    it("should request data on initialization", () => {
        /**
         * Check: Verifies that the smart component correctly
         * triggers the data fetching on init.
         */
        expect(facadeMock.loadItems).toHaveBeenCalled();
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