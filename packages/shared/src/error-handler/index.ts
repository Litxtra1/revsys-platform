export interface AppErrorOptions {
  code: string;
  statusCode: number;
  details?: Record<string, unknown> | undefined;
}

export class AppError extends Error {
  readonly code: string;
  readonly statusCode: number;
  readonly details?: Record<string, unknown> | undefined;

  constructor(message: string, options: AppErrorOptions) {
    super(message);
    this.name = this.constructor.name;
    this.code = options.code;
    this.statusCode = options.statusCode;
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { code: "VALIDATION_ERROR", statusCode: 400, details });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required.") {
    super(message, { code: "AUTHENTICATION_ERROR", statusCode: 401 });
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, { code: "AUTHORIZATION_ERROR", statusCode: 403 });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found.`, { code: "NOT_FOUND", statusCode: 404 });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, { code: "CONFLICT", statusCode: 409, details });
  }
}

export interface ErrorResponseBody {
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: Record<string, unknown>;
  };
}

/**
 * Normalizes any thrown value into a consistent, safe-to-serialize shape.
 * Non-AppError values are collapsed to a generic message so internal
 * details never leak to a client response.
 */
export function toErrorResponse(error: unknown): ErrorResponseBody {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        ...(error.details ? { details: error.details } : {}),
      },
    };
  }

  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred.",
      statusCode: 500,
    },
  };
}
