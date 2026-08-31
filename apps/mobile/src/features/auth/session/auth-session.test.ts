import type { AuthTokens } from '@/features/auth/types/auth.types';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

const createDeferred = <T>(): Deferred<T> => {
  let resolve: Deferred<T>['resolve'] = () => undefined;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
};

const loadAuthSession = async () => {
  let storedRefreshToken: string | null = 'stored-refresh-token';
  const refresh = jest.fn<Promise<AuthTokens>, [string]>();
  const logout = jest
    .fn<Promise<void>, [string]>()
    .mockResolvedValue(undefined);
  const clear = jest.fn(async () => {
    storedRefreshToken = null;
  });
  const get = jest.fn(async () => storedRefreshToken);
  const set = jest.fn(async (token: string) => {
    storedRefreshToken = token;
  });

  jest.doMock('@/features/auth/api/auth.api', () => ({
    authApi: { logout, refresh },
  }));
  jest.doMock('@/features/auth/storage/token-storage', () => ({
    refreshTokenStorage: { clear, get, set },
  }));
  jest.doMock('@/api/client', () => ({
    apiClient: { setAuthHandler: jest.fn() },
  }));

  const authSession = await import('./auth-session');

  return {
    authSession,
    clear,
    getStoredRefreshToken: () => storedRefreshToken,
    logout,
    refresh,
    set,
  };
};

describe('logoutSession', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('revokes a rotated refresh token when logout overlaps refresh', async () => {
    const refreshResponse = createDeferred<AuthTokens>();
    const { authSession, clear, logout, refresh, set } =
      await loadAuthSession();
    refresh.mockReturnValue(refreshResponse.promise);

    const refreshResult = authSession.refreshSession();
    await Promise.resolve();
    const logoutResult = authSession.logoutSession();
    refreshResponse.resolve({
      accessToken: 'fresh-access-token',
      refreshToken: 'rotated-refresh-token',
    });

    await expect(refreshResult).resolves.toBe(false);
    await expect(logoutResult).resolves.toBeUndefined();
    expect(logout).toHaveBeenCalledWith('rotated-refresh-token');
    expect(set).not.toHaveBeenCalled();
    expect(clear).toHaveBeenCalledTimes(1);
    expect(authSession.getAccessToken()).toBeNull();
  });

  it('clears local session data when remote revocation fails', async () => {
    const { authSession, clear, getStoredRefreshToken, logout } =
      await loadAuthSession();
    logout.mockRejectedValue(new Error('Network unavailable'));

    await expect(authSession.logoutSession()).rejects.toThrow(
      'Network unavailable',
    );
    expect(clear).toHaveBeenCalledTimes(1);
    expect(getStoredRefreshToken()).toBeNull();
    expect(authSession.getAccessToken()).toBeNull();
  });
});

describe('clearSession', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('keeps local session data cleared when an earlier refresh finishes late', async () => {
    const refreshResponse = createDeferred<AuthTokens>();
    const { authSession, clear, getStoredRefreshToken, refresh, set } =
      await loadAuthSession();
    refresh.mockReturnValue(refreshResponse.promise);

    const refreshResult = authSession.refreshSession();
    await Promise.resolve();
    await authSession.clearSession();
    refreshResponse.resolve({
      accessToken: 'late-access-token',
      refreshToken: 'late-refresh-token',
    });

    await expect(refreshResult).resolves.toBe(false);
    expect(set).not.toHaveBeenCalled();
    expect(clear).toHaveBeenCalledTimes(1);
    expect(getStoredRefreshToken()).toBeNull();
    expect(authSession.getAccessToken()).toBeNull();
  });
});
