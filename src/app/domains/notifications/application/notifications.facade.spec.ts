import {TestBed} from "@angular/core/testing";
import {HttpClient, HttpContext, HttpErrorResponse} from "@angular/common/http";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {throwError} from "rxjs";
import {NotificationsFacade} from "./notifications.facade";
import {NotificationOptions, NotificationType, NOTIFICATION_TICKET} from "@core/notifications/notification.models";
import {NotificationService} from "@core/notifications/notification.service";
import {AuthFacade} from "@core/auth";
import {API_BASE_URL} from "@core/http/api.tokens";

/**
 * @description
 * Unit tests for NotificationsFacade.
 */
const describeNotificationsFacade = (): void => {
    let facade: NotificationsFacade;
    let httpClientMock: { get: ReturnType<typeof vi.fn> };
    let authFacadeMock: { logout: ReturnType<typeof vi.fn> };
    let notificationServiceMock: {
        registerTicket: ReturnType<typeof vi.fn>;
        defaultErrorNotificationObject: NotificationOptions;
    };

    const defaultErrorNotificationObject: NotificationOptions = {
        message: "An error occurred.",
        type: NotificationType.Error,
        actionLabel: "OK",
        clearExisting: true,
        duration: 4000,
    };

    /**
     * @description
     * Creates a deterministic HttpErrorResponse for server errors.
     */
    const createServerError = (): HttpErrorResponse => {
        return new HttpErrorResponse({
            status: 500,
            statusText: "Internal Server Error",
        });
    };

    /**
     * @description
     * Creates a deterministic HttpErrorResponse for unauthorized errors.
     */
    const createUnauthorizedError = (): HttpErrorResponse => {
        return new HttpErrorResponse({
            status: 401,
            statusText: "Unauthorized",
        });
    };

    /**
     * @description
     * Extracts the HttpContext from a mocked HttpClient call.
     */
    const extractContext = (callArgs: unknown[]): HttpContext | undefined => {
        const options = callArgs[1] as { context?: HttpContext } | undefined;
        return options?.context;
    };

    /**
     * @description
     * Creates a minimal HttpClient mock used by the facade tests.
     */
    const createHttpClientMock = (): { get: ReturnType<typeof vi.fn> } => {
        return {
            get: vi.fn(),
        };
    };

    /**
     * @description
     * Creates an AuthFacade mock with a logout spy.
     */
    const createAuthFacadeMock = (): { logout: ReturnType<typeof vi.fn> } => {
        return {
            logout: vi.fn(),
        };
    };

    /**
     * @description
     * Creates a NotificationService mock with default error options.
     */
    const createNotificationServiceMock = (): {
        registerTicket: ReturnType<typeof vi.fn>;
        defaultErrorNotificationObject: NotificationOptions;
    } => {
        return {
            registerTicket: vi.fn(),
            defaultErrorNotificationObject,
        };
    };

    /**
     * @description
     * Configures the Angular TestBed with mocked dependencies.
     */
    const setupTestBed = (): void => {
        httpClientMock = createHttpClientMock();
        authFacadeMock = createAuthFacadeMock();
        notificationServiceMock = createNotificationServiceMock();

        TestBed.configureTestingModule({
            providers: [
                NotificationsFacade,
                {provide: HttpClient, useValue: httpClientMock},
                {provide: AuthFacade, useValue: authFacadeMock},
                {provide: NotificationService, useValue: notificationServiceMock},
                {provide: API_BASE_URL, useValue: "https://api.test"},
            ],
        });

        facade = TestBed.inject(NotificationsFacade);
    };

    beforeEach(setupTestBed);

    /**
     * @description
     * Verifies custom error messages register a ticket and attach the HttpContext.
     */
    const shouldRegisterTicketForCustomError = (): void => {
        const customMessage = "Custom error message";
        const ticketId = "ticket-1";

        notificationServiceMock.registerTicket.mockReturnValue(ticketId);
        httpClientMock.get.mockReturnValue(throwError(createServerError));

        facade.simulateError(customMessage);

        expect(notificationServiceMock.registerTicket).toHaveBeenCalledWith({
            ...defaultErrorNotificationObject,
            message: customMessage,
        });
        expect(httpClientMock.get).toHaveBeenCalledTimes(1);

        const context = extractContext(httpClientMock.get.mock.calls[0]);
        expect(context?.get(NOTIFICATION_TICKET)).toBe(ticketId);
    };

    it("should register a ticket for custom error simulations", shouldRegisterTicketForCustomError);

    /**
     * @description
     * Verifies empty messages do not register tickets or contexts.
     */
    const shouldSkipTicketForEmptyErrorMessage = (): void => {
        httpClientMock.get.mockReturnValue(throwError(createServerError));

        facade.simulateError("   ");

        expect(notificationServiceMock.registerTicket).not.toHaveBeenCalled();
        expect(httpClientMock.get).toHaveBeenCalledTimes(1);

        const context = extractContext(httpClientMock.get.mock.calls[0]);
        expect(context).toBeUndefined();
    };

    it("should skip ticket registration when the custom message is empty", shouldSkipTicketForEmptyErrorMessage);

    /**
     * @description
     * Verifies unauthorized simulations trigger logout and attach the custom ticket.
     */
    const shouldLogoutOnUnauthorizedWithCustomTicket = (): void => {
        const customMessage = "Session expired";
        const ticketId = "ticket-2";

        notificationServiceMock.registerTicket.mockReturnValue(ticketId);
        httpClientMock.get.mockReturnValue(throwError(createUnauthorizedError));

        facade.simulateUnauthorized(customMessage);

        expect(notificationServiceMock.registerTicket).toHaveBeenCalledWith({
            ...defaultErrorNotificationObject,
            message: customMessage,
        });
        expect(authFacadeMock.logout).toHaveBeenCalledTimes(1);

        const context = extractContext(httpClientMock.get.mock.calls[0]);
        expect(context?.get(NOTIFICATION_TICKET)).toBe(ticketId);
    };

    it("should logout on unauthorized errors and attach the custom ticket", shouldLogoutOnUnauthorizedWithCustomTicket);
};
describe("NotificationsFacade", describeNotificationsFacade);
