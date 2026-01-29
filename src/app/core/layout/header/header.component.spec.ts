import {ChangeDetectionStrategy, Component, signal} from "@angular/core";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";
import {provideRouter, Router, RouterLink, Routes} from "@angular/router";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {HeaderComponent} from "./header.component";
import {AuthFacade} from "@core/auth";

/**
 * @description
 * Unit tests for HeaderComponent.
 * Validates authenticated vs unauthenticated rendering and logout behavior.
 */

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: "",
    standalone: true,
})
class DummyRouteComponent {
}

const routes: Routes = [
    {path: "login", component: DummyRouteComponent},
    {path: "dashboard", component: DummyRouteComponent},
    {path: "notifications", component: DummyRouteComponent},
];

describe("HeaderComponent", () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;
    let authFacadeMock: {
        isAuthenticated: ReturnType<typeof signal<boolean>>;
        user: ReturnType<typeof signal<{ id: string; username: string } | null>>;
        logout: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
        authFacadeMock = {
            isAuthenticated: signal(false),
            user: signal<{ id: string; username: string } | null>(null),
            logout: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                {provide: AuthFacade, useValue: authFacadeMock},
                provideRouter(routes),
            ],
        }).compileComponents();

        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render sign-in button when unauthenticated", () => {
        fixture.detectChanges();

        const buttons = Array.from(
            fixture.nativeElement.querySelectorAll("button"),
        ) as HTMLButtonElement[];
        const signInButton = buttons.find((btn) => btn.textContent?.includes("Sign In"));
        const logoutButton = buttons.find((btn) => btn.textContent?.includes("Logout"));

        expect(signInButton).toBeTruthy();
        expect(logoutButton).toBeFalsy();
    });

    it("should render dashboard link and username when authenticated", () => {
        authFacadeMock.isAuthenticated.set(true);
        authFacadeMock.user.set({id: "u-1", username: "Arne"});
        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toContain("Arne");

        const links = fixture.debugElement.queryAll(By.directive(RouterLink));
        const dashboardLink = links.find((link) => link.attributes["routerLink"] === "/dashboard");
        const notificationsLink = links.find(
            (link) => link.attributes["routerLink"] === "/notifications",
        );
        expect(dashboardLink).toBeTruthy();
        expect(notificationsLink).toBeTruthy();
    });

    it("should call logout when clicking the logout button", () => {
        authFacadeMock.isAuthenticated.set(true);
        authFacadeMock.user.set({id: "u-1", username: "Arne"});
        fixture.detectChanges();

        const buttons = Array.from(
            fixture.nativeElement.querySelectorAll("button"),
        ) as HTMLButtonElement[];
        const logoutButton = buttons.find((btn) => btn.textContent?.includes("Logout"));
        expect(logoutButton).toBeTruthy();
        logoutButton?.click();

        expect(authFacadeMock.logout).toHaveBeenCalled();
    });

    /**
     * @description
     * Ensures the header hides all actions on the login route.
     */
    it("should hide the action area when on the login page", async () => {
        await router.navigateByUrl("/login");
        fixture.detectChanges();

        const actions = fixture.nativeElement.querySelector(".wtx-header__actions");
        expect(actions).toBeNull();
    });
});

