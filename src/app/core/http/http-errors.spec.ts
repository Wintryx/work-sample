import {HttpErrorResponse} from "@angular/common/http";
import {describe, expect, it} from "vitest";
import {parseErrorMessage} from "./http-errors";

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