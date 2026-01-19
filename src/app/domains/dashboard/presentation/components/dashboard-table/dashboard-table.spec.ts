import {ComponentFixture, TestBed} from "@angular/core/testing";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {DashboardTableComponent} from "./dashboard-table";
import {DashboardItem, ItemStatus} from "@domains/dashboard";

/**
 * @description
 * Unit tests for the presentational DashboardTableComponent.
 * Focuses on correct data rendering and event emission (interaction).
 */
describe("DashboardTableComponent", () => {
    let component: DashboardTableComponent;
    let fixture: ComponentFixture<DashboardTableComponent>;

    // Mock Data
    const mockItems: DashboardItem[] = [
        {id: "1", title: "Test Item 1", status: ItemStatus.Done, progress: 100},
        {id: "2", title: "Test Item 2", status: ItemStatus.Todo, progress: 0},
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardTableComponent],
            providers: []
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardTableComponent);
        component = fixture.componentInstance;

        /**
         * Tip: Using componentRef.setInput() is the official way to test
         * the new Angular Signal-based inputs.
         */
        fixture.componentRef.setInput("items", mockItems);
        fixture.detectChanges();
    });

    it("should render the correct number of rows", () => {
        const rows = fixture.nativeElement.querySelectorAll("tr.mat-mdc-row");
        expect(rows.length).toBe(mockItems.length);
    });

    it("should emit selectItem event with correct ID when a row is clicked", () => {
        // 1. Setup a spy on the output
        const emitSpy = vi.fn();
        component.selectItem.subscribe(emitSpy);

        // 2. Simulate click on the first data row (mat-mdc-row)
        const firstRow = fixture.nativeElement.querySelector("tr.mat-mdc-row");
        firstRow?.dispatchEvent(new MouseEvent("click"));

        // 3. Verify interaction
        expect(emitSpy).toHaveBeenCalledWith("1");
    });

    it("should display the formatted title in the data cell", () => {
        /**
         * Fix: Specifically target the <td> (data cell) to avoid collision
         * with the <th> (header cell) which shares the same CSS class.
         */
        const firstDataCell = fixture.nativeElement.querySelector("td.mat-column-title");

        expect(firstDataCell).toBeTruthy();
        expect(firstDataCell.textContent).toContain("Test Item 1");
    });
});
