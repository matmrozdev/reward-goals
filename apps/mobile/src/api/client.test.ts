import { ApiClient } from './client';

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { 'content-type': 'application/json' },
    status,
  });

describe('ApiClient.request', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('shares one refresh across concurrent unauthorized requests', async () => {
    const client = new ApiClient();
    let accessToken = 'expired-access-token';
    let resolveRefresh!: (value: boolean) => void;
    const refreshResult = new Promise<boolean>((resolve) => {
      resolveRefresh = resolve;
    });
    const refreshSession = jest.fn(() => refreshResult);
    const attempts = new Map<string, number>();
    const fetchMock = jest.fn(
      async (input: string | URL | Request, _init?: RequestInit) => {
        const path = new URL(input.toString()).pathname;
        const attempt = (attempts.get(path) ?? 0) + 1;
        attempts.set(path, attempt);

        return attempt === 1
          ? jsonResponse(401, { message: 'Unauthorized' })
          : jsonResponse(200, { path });
      },
    );
    globalThis.fetch = fetchMock as typeof fetch;
    client.setAuthHandler({
      getAccessToken: () => accessToken,
      refreshSession,
    });

    const firstRequest = client.request<{ path: string }>('/first', {
      authenticated: true,
    });
    const secondRequest = client.request<{ path: string }>('/second', {
      authenticated: true,
    });
    await Promise.resolve();
    await Promise.resolve();
    accessToken = 'fresh-access-token';
    resolveRefresh(true);

    await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual([
      { path: '/first' },
      { path: '/second' },
    ]);
    expect(refreshSession).toHaveBeenCalledTimes(1);
    const retryRequests = fetchMock.mock.calls.slice(2);
    expect(retryRequests).toHaveLength(2);
    retryRequests.forEach(([, options]) => {
      expect(new Headers(options?.headers).get('Authorization')).toBe(
        'Bearer fresh-access-token',
      );
    });
  });

  it('retries an authenticated request only once', async () => {
    const client = new ApiClient();
    const refreshSession = jest.fn().mockResolvedValue(true);
    const fetchMock = jest
      .fn()
      .mockResolvedValue(jsonResponse(401, { message: 'Unauthorized' }));
    globalThis.fetch = fetchMock as typeof fetch;
    client.setAuthHandler({
      getAccessToken: () => 'access-token',
      refreshSession,
    });

    await expect(
      client.request('/protected', { authenticated: true }),
    ).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });
});
