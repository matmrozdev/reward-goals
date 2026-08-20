import { env } from '@/config/env';

import { ApiError } from './errors';

type AuthHandler = {
  getAccessToken: () => string | null;
  refreshSession: () => Promise<boolean>;
};

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  authenticated?: boolean;
  body?: unknown;
};

const parseResponseBody = async (response: Response) => {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const text = await response.text();

    if (!text) {
      return undefined;
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      throw new ApiError('The API returned an invalid JSON response.', {
        status: response.status,
      });
    }
  }

  const text = await response.text();
  return text || undefined;
};

export class ApiClient {
  private authHandler?: AuthHandler;
  private refreshPromise?: Promise<boolean>;

  setAuthHandler(authHandler: AuthHandler) {
    this.authHandler = authHandler;
  }

  async request<T>(path: string, options: ApiRequestOptions = {}) {
    return this.requestAttempt<T>(path, options, false);
  }

  private async requestAttempt<T>(
    path: string,
    options: ApiRequestOptions,
    hasRetried: boolean,
  ): Promise<T> {
    const { authenticated = false, body, headers, ...requestInit } = options;
    const requestHeaders = new Headers(headers);
    const accessToken = authenticated
      ? this.authHandler?.getAccessToken()
      : null;

    requestHeaders.set('Accept', 'application/json');

    if (body !== undefined) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    if (accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }

    let response: Response;

    try {
      response = await fetch(`${env.apiUrl}${path}`, {
        ...requestInit,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: requestHeaders,
      });
    } catch (error) {
      throw ApiError.fromUnknown(error);
    }

    if (
      response.status === 401 &&
      authenticated &&
      !hasRetried &&
      (await this.refreshAccessToken())
    ) {
      return this.requestAttempt<T>(path, options, true);
    }

    const responseBody = await parseResponseBody(response);

    if (!response.ok) {
      throw ApiError.fromResponse(response.status, responseBody);
    }

    return responseBody as T;
  }

  private async refreshAccessToken() {
    if (!this.authHandler) {
      return false;
    }

    const pendingRefresh = (this.refreshPromise ??=
      this.authHandler.refreshSession());

    try {
      return await pendingRefresh;
    } finally {
      if (this.refreshPromise === pendingRefresh) {
        this.refreshPromise = undefined;
      }
    }
  }
}

export const apiClient = new ApiClient();
