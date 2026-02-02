import {TestBed} from "@angular/core/testing";
import {HttpClient, HttpContext, HttpErrorResponse} from "@angular/common/http";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {of, throwError} from "rxjs";
import {FormsFacade} from "./forms.facade";
import {API_BASE_URL} from "@core/http/api.tokens";
import {FormConfig, FormValueMap} from "@domains/forms";
import {NotificationService} from "@core/notifications/notification.service";
import {FEEDBACK_CONTEXT} from "@core/notifications";
import {NotificationType} from "@core/notifications/notification.models";

describe("FormsFacade", () => {
    let facade: FormsFacade;
    let httpClientMock: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };
    let notificationServiceMock: { notifyError: ReturnType<typeof vi.fn> };

    const mockConfig: FormConfig = {
        id: "user-profile",
        title: "User Profile",
        fields: [
            {key: "username", type: "text", label: "Username"},
        ],
    };

    beforeEach(() => {
        httpClientMock = {
            get: vi.fn(),
            post: vi.fn(),
        };
        notificationServiceMock = {
            notifyError: vi.fn(),
        };

        TestBed.configureTestingModule({
            providers: [
                FormsFacade,
                {provide: HttpClient, useValue: httpClientMock},
                {provide: NotificationService, useValue: notificationServiceMock},
                {provide: API_BASE_URL, useValue: "https://api.test"},
            ],
        });

        facade = TestBed.inject(FormsFacade);
    });

    it("should load a form configuration and update state", () => {
        httpClientMock.get.mockReturnValue(of(mockConfig));

        facade.loadFormConfig("user-profile");

        expect(httpClientMock.get).toHaveBeenCalledWith("https://api.test/forms/user-profile");
        expect(facade.formConfig()).toEqual(mockConfig);
        expect(facade.isLoading()).toBe(false);
        expect(facade.error()).toBeNull();
    });

    it("should report errors when loading fails", () => {
        httpClientMock.get.mockReturnValue(
            throwError(() => new HttpErrorResponse({status: 400, statusText: "Bad Request"})),
        );

        facade.loadFormConfig("user-profile");

        expect(notificationServiceMock.notifyError).toHaveBeenCalledWith("Bad Request");
        expect(facade.error()).toBe("Bad Request");
    });

    it("should attach feedback context on submit", () => {
        const formData: FormValueMap = {username: "Arne"};
        httpClientMock.post.mockReturnValue(of({}));

        facade.submitForm("user-profile", formData);

        expect(httpClientMock.post).toHaveBeenCalledTimes(1);
        const [, , options] = httpClientMock.post.mock.calls[0] as [string, FormValueMap, { context?: HttpContext }];

        expect(options?.context).toBeInstanceOf(HttpContext);
        const feedback = options?.context?.get(FEEDBACK_CONTEXT);
        expect(feedback?.message).toBe("Form submitted successfully!");
        expect(feedback?.type).toBe(NotificationType.Success);
    });
});
