type ApiErrorBody = {
  code?: string;
  error?: string;
  message?: string | string[];
};

const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === 'object' && value !== null;

const getErrorMessage = (body: unknown, fallback: string) => {
  if (!isApiErrorBody(body)) {
    return fallback;
  }

  if (Array.isArray(body.message)) {
    return body.message.join('\n');
  }

  return body.message ?? body.error ?? fallback;
};

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; details?: unknown } = {},
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }

  static fromResponse(status: number, body: unknown) {
    const fallback = `The request failed with status ${status}.`;
    const code = isApiErrorBody(body) ? body.code : undefined;

    return new ApiError(getErrorMessage(body, fallback), {
      status,
      code,
      details: body,
    });
  }

  static fromUnknown(error: unknown) {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(error.message);
    }

    return new ApiError('The request could not be completed.');
  }
}
