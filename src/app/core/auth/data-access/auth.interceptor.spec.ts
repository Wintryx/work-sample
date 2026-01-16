import {TestBed} from '@angular/core/testing';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {authInterceptor} from './auth.interceptor';
import {AuthService} from './auth.service';

/**
 * @description
 * Unit tests for the functional Auth Interceptor.
 * Validates the injection of the Authorization header using Vitest and HttpTestingController.
 */
describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  /**
   * @description
   * Vitest mock for the AuthService.
   * We mock getToken to simulate different authentication states.
   */
  const authServiceMock = {
    getToken: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: AuthService, useValue: authServiceMock},
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    // ensure that the call history of our spies is reset between tests.
    vi.clearAllMocks();
  });

  it('should append Authorization header if token is present', () => {
    // Arrange
    const mockToken = 'senior-level-token-123';
    authServiceMock.getToken.mockReturnValue(mockToken);

    // Act
    httpClient.get('/api/resource').subscribe();

    // Assert
    const req = httpMock.expectOne('/api/resource');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });

  it('should NOT append Authorization header if token is missing', () => {
    // Arrange
    authServiceMock.getToken.mockReturnValue(null);

    // Act
    httpClient.get('/api/resource').subscribe();

    // Assert
    const req = httpMock.expectOne('/api/resource');
    expect(req.request.headers.has('Authorization')).toBe(false);
  });
});
