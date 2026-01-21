import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {LoginPageComponent} from "./login-page.component";
import {AuthFacade} from "@core/auth";

/**
 * @description
 * Unit tests for LoginPage.
 * Validates form behavior and login submission flow.
 */

describe("LoginPage", () => {
    let component: LoginPageComponent;
    let fixture: ComponentFixture<LoginPageComponent>;
    let authFacadeMock: { login: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        authFacadeMock = {login: vi.fn()};

        await TestBed.configureTestingModule({
            imports: [LoginPageComponent],
            providers: [{provide: AuthFacade, useValue: authFacadeMock}],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPageComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call AuthFacade.login on valid submit", () => {
        const form = (component as unknown as { loginForm: typeof component["loginForm"] }).loginForm;
        form.setValue({username: "Jane", password: "epm"});
        fixture.detectChanges();

        const formDebug = fixture.debugElement.query(By.css("form"));
        formDebug.triggerEventHandler("ngSubmit", {});

        expect(authFacadeMock.login).toHaveBeenCalledWith("Jane", "epm");
    });

    it("should not call AuthFacade.login when form is invalid", () => {
        const form = (component as unknown as { loginForm: typeof component["loginForm"] }).loginForm;
        form.setValue({username: "", password: "epm"});
        fixture.detectChanges();

        const formDebug = fixture.debugElement.query(By.css("form"));
        formDebug.triggerEventHandler("ngSubmit", {});

        expect(authFacadeMock.login).not.toHaveBeenCalled();
    });

    it("should disable submit button when form is invalid", () => {
        const form = (component as unknown as { loginForm: typeof component["loginForm"] }).loginForm;
        form.setValue({username: "", password: "epm"});
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector(
            "button[type='submit']",
        ) as HTMLButtonElement;

        expect(button.disabled).toBe(true);
    });
});

