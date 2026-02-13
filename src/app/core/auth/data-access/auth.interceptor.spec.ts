import { TestBed } from "@angular/core/testing";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authInterceptor } from "@core/auth";
import { AuthService } from "./auth.service";

/**
 * @description
 * Integration test for the functional Auth Interceptor.
 * Ensures that security tokens are correctly injected into outgoing requests.
 */
describe("authInterceptor", () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  // Create a clean mock for the AuthService using Vitest spies
  const authServiceMock = {
    getToken: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures no outstanding requests remain
    vi.clearAllMocks();
  });

  it("should append Authorization header if a token is available", () => {
    const mockToken = "eyJhbGci.mock.token";
    authServiceMock.getToken.mockReturnValue(mockToken);

    httpClient.get("/api/secure-data").subscribe();

    const req = httpMock.expectOne("/api/secure-data");
    expect(req.request.headers.get("Authorization")).toBe(`Bearer ${mockToken}`);
  });

  it("should NOT append Authorization header if token is missing", () => {
    authServiceMock.getToken.mockReturnValue(null);

    httpClient.get("/api/public-data").subscribe();

    const req = httpMock.expectOne("/api/public-data");
    expect(req.request.headers.has("Authorization")).toBe(false);
  });
});
