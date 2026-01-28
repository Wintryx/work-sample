import {HttpErrorResponse} from "@angular/common/http";
import {describe, expect, it} from "vitest";
import {normalizeApiError, parseErrorMessage} from "./http-errors";

/**
 * @description
 * Unit tests for the global error parsing utility.
 * Validates that structured backend errors are correctly prioritized
 * over technical transport strings.
 */
describe("parseErrorMessage", () => {
    it("should extract message from structured ApiError body", () => {
        const apiError = {status: 400, message: "Domain Validation Failed"};
        expect(parseErrorMessage(apiError)).toBe("Domain Validation Failed");
    });

    it("should extract nested message from Angular HttpErrorResponse", () => {
        const httpError = new HttpErrorResponse({
            error: {message: "Simulated Backend Error"},
            status: 500
        });
        expect(parseErrorMessage(httpError)).toBe("Simulated Backend Error");
    });

    it("should fallback to statusText if body is empty", () => {
        const httpError = new HttpErrorResponse({
            status: 404,
            statusText: "Not Found"
        });
        expect(parseErrorMessage(httpError)).toBe("Not Found");
    });

    it("should return the provided fallback for unknown error shapes", () => {
        const fallback = "Global Fallback";
        expect(parseErrorMessage(null, fallback)).toBe(fallback);
        expect(parseErrorMessage({}, fallback)).toBe(fallback);
    });
});

describe("normalizeApiError", () => {
    it("should normalize ApiError into a consistent structure", () => {
        const apiError = {status: 400, message: "Domain Validation Failed", code: "VALIDATION"};
        const normalized = normalizeApiError(apiError, "Fallback");
        expect(normalized.message).toBe("Domain Validation Failed");
        expect(normalized.status).toBe(400);
        expect(normalized.code).toBe("VALIDATION");
        expect(normalized.apiError).toEqual(apiError);
    });

    it("should normalize HttpErrorResponse with nested body", () => {
        const httpError = new HttpErrorResponse({
            error: {status: 500, message: "Simulated Backend Error", code: "E_SIM"},
            status: 500,
        });
        const normalized = normalizeApiError(httpError, "Fallback");
        expect(normalized.message).toBe("Simulated Backend Error");
        expect(normalized.status).toBe(500);
        expect(normalized.code).toBe("E_SIM");
    });

    it("should normalize HttpErrorResponse with statusText fallback", () => {
        const httpError = new HttpErrorResponse({
            status: 404,
            statusText: "Not Found",
        });
        const normalized = normalizeApiError(httpError, "Fallback");
        expect(normalized.message).toBe("Not Found");
        expect(normalized.status).toBe(404);
    });

    it("should use fallback for unknown shapes", () => {
        const normalized = normalizeApiError(undefined, "Fallback");
        expect(normalized.message).toBe("Fallback");
    });
});
