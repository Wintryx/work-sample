import { PLATFORM_ID } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "./auth.service";
import {
  AUTH_CONFIG,
  AUTH_COOKIE_NAME,
  AUTH_SESSION_KEY,
  AuthErrorState,
  AuthStatus,
} from "@core/auth";
import { CookieService } from "@core/services/cookie.service";

/**
 * @description
 * Unit tests for AuthService.
 * Validates core authentication infrastructure logic.
 */
describe("AuthService", () => {
  let cookieServiceMock: { set: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };

  const config = {
    oidcIssuer: "https://fake-idp.example",
    audience: "wintryx-progress-maker",
    stateKeyPrefix: "test_oidc_state",
    nonceKeyPrefix: "test_oidc_nonce",
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    cookieServiceMock = {
      set: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: "browser" },
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: AUTH_CONFIG, useValue: config },
      ],
    });
  });

  it("should be created", () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it("should reject invalid passwords", () => {
    const service = TestBed.inject(AuthService);
    const result = service.login("Arne", "wrong");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.authErrorState).toBe(AuthErrorState.INVALID_PASSWORD);
      expect(result.error.status).toBe(AuthStatus.Unauthenticated);
    }
    expect(cookieServiceMock.set).not.toHaveBeenCalled();
  });

  it("should persist session and set cookie on successful login", () => {
    const service = TestBed.inject(AuthService);
    const result = service.login("Arne", "epm");

    expect(result.ok).toBe(true);
    expect(service.state().status).toBe(AuthStatus.Authenticated);
    expect(cookieServiceMock.set).toHaveBeenCalledWith(AUTH_COOKIE_NAME, "true");
    expect(localStorage.getItem(AUTH_SESSION_KEY)).not.toBeNull();
    expect(service.getToken()).not.toBeNull();
  });

  it("should hydrate session from localStorage", () => {
    const session = {
      status: AuthStatus.Authenticated,
      user: { id: "u-1", username: "Arne" },
      token: "mock-token",
    };
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

    const service = TestBed.inject(AuthService);

    expect(service.state().status).toBe(AuthStatus.Authenticated);
    expect(service.getToken()).toBe("mock-token");
  });
});
