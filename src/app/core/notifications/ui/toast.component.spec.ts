import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ToastComponent } from "./toast.component";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material/snack-bar";
import { NotificationOptions, NotificationType } from "@core/notifications";
import { By } from "@angular/platform-browser";

describe("ToastComponent", () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  // Use a partial mock type instead of any for strict type safety
  let snackBarRefMock: { dismissWithAction: ReturnType<typeof vi.fn> };

  const mockData: NotificationOptions = {
    message: "Test Message",
    type: NotificationType.Success,
    actionLabel: "Close",
  };

  beforeEach(async () => {
    snackBarRefMock = {
      dismissWithAction: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRefMock },
        { provide: MAT_SNACK_BAR_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display the correct message", () => {
    const messageEl = fixture.debugElement.query(By.css("span")).nativeElement;
    expect(messageEl.textContent).toContain("Test Message");
  });

  it("should apply correct content classes for success type", () => {
    // Success type is set in mockData (white text)
    expect(component.contentClass()).toBe("text-white");
  });

  it("should dismiss the snackbar when close button is clicked", () => {
    const button = fixture.debugElement.query(By.css("button"));
    button.triggerEventHandler("click", null);
    expect(snackBarRefMock.dismissWithAction).toHaveBeenCalled();
  });

  it("should apply correct content classes for warning type", () => {
    // Re-create component with Warning data
    TestBed.resetTestingModule();
    const warningData = { ...mockData, type: NotificationType.Warning };

    TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: snackBarRefMock },
        { provide: MAT_SNACK_BAR_DATA, useValue: warningData },
      ],
    });

    const localFixture = TestBed.createComponent(ToastComponent);
    const localComponent = localFixture.componentInstance;

    expect(localComponent.contentClass()).toBe("text-slate-900");
  });
});
