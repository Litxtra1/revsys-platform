import { describe, expect, it } from "vitest";
import {
  AppError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
  toErrorResponse,
} from "./index";

describe("toErrorResponse", () => {
  it("normalizes an AppError with its code and status", () => {
    const error = new ValidationError("Invalid input.", { field: "email" });
    expect(toErrorResponse(error)).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid input.",
        statusCode: 400,
        details: { field: "email" },
      },
    });
  });

  it("collapses unknown errors to a generic safe message", () => {
    const response = toErrorResponse(new Error("some internal stack trace detail"));
    expect(response).toEqual({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred.",
        statusCode: 500,
      },
    });
  });

  it("collapses non-Error thrown values the same way", () => {
    expect(toErrorResponse("a string was thrown").error.code).toBe("INTERNAL_ERROR");
  });
});

describe("AppError subclasses", () => {
  it("NotFoundError sets a 404 status and message", () => {
    const error = new NotFoundError("Store");
    expect(error).toBeInstanceOf(AppError);
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe("Store not found.");
  });

  it("AuthenticationError defaults to a 401 status", () => {
    const error = new AuthenticationError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("AUTHENTICATION_ERROR");
  });
});
