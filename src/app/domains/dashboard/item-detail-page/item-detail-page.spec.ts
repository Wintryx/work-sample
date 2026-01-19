import {ComponentFixture, TestBed} from "@angular/core/testing";
import {provideRouter, RouterLink} from "@angular/router";
import {beforeEach, describe, expect, it} from "vitest";
import {ItemDetailPage} from "./item-detail-page";
import {DashboardFacade} from "../dashboard.facade";
import {signal} from "@angular/core";
import {DashboardItemDto, ItemStatus} from "@domains/dashboard";
import {By} from "@angular/platform-browser";

/**
 * @description
 * Integration tests for ItemDetailPage.
 * Validates modern Signal-based routing inputs and reactive data binding.
 */
describe("ItemDetailPage", () => {
    let fixture: ComponentFixture<ItemDetailPage>;

    // Senior-Tip: Ensure mock data is strictly typed
    const MOCK_ITEM: DashboardItemDto = {
        id: "p-101",
        title: "Mock Feature",
        status: ItemStatus.InProgress,
        progress: 50
    };

    const facadeMock = {
        // Initializing with the mock data to avoid 'Not Found' state during first render
        items: signal<DashboardItemDto[]>([MOCK_ITEM]),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ItemDetailPage],
            providers: [
                {provide: DashboardFacade, useValue: facadeMock},
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ItemDetailPage);
        // Note: No initial detectChanges() here to allow setInput() first.
    });

    it("should find and display an item based on the ID input signal", () => {
        // 1. Arrange: Simulating the Router providing the ID
        fixture.componentRef.setInput("id", "p-101");

        // 2. Act: Run change detection to resolve the 'item' computed signal
        fixture.detectChanges();

        // 3. Assert: Querying semantically (using the class we defined in SCSS)
        const host = fixture.nativeElement as HTMLElement;
        const titleElement = host.querySelector<HTMLElement>(".main-title");

        expect(titleElement).not.toBeNull();
        if (titleElement) {
            expect(titleElement.textContent).toContain("Mock Feature");
        }
    });

    it("should show the 'Not Found' state if the ID does not match any item", () => {
        fixture.componentRef.setInput("id", "non-existent-id");
        fixture.detectChanges();

        const host = fixture.nativeElement as HTMLElement;
        const headings = Array.from(host.querySelectorAll<HTMLHeadingElement>("h3"));
        const notFoundHeading = headings.find((el) =>
            el.textContent?.includes("Feature not found"),
        );
        expect(notFoundHeading).toBeTruthy();
    });

    it("should have a functional 'Back to Dashboard' link", () => {
        // Basic setup to render the navigation
        fixture.componentRef.setInput("id", "p-101");
        fixture.detectChanges();

        const backLink = fixture.debugElement.query(By.directive(RouterLink));
        expect(backLink).toBeTruthy();
        expect(backLink.attributes["routerLink"]).toBe("/dashboard");
    });
});

