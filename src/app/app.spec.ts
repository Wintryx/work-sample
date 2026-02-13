import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./app";
import { AuthFacade } from "@core/auth";

/**
 * @description
 * Unit tests for the App shell.
 * Verifies the base layout elements are rendered.
 */

describe("App", () => {
  beforeEach(async () => {
    const authFacadeMock = {
      isAuthenticated: signal(false),
      user: signal<{ id: string; username: string } | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), { provide: AuthFacade, useValue: authFacadeMock }],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should render header and footer components", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector("app-header-component")).toBeTruthy();
    expect(host.querySelector("app-footer-component")).toBeTruthy();
  });

  it("should include a router outlet in the layout", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector("router-outlet")).toBeTruthy();
  });
});
