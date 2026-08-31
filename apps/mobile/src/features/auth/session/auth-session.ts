import { ApiError } from '@/api/errors';

import { apiClient } from '@/api/client';

import { authApi } from '@/features/auth/api/auth.api';
import { refreshTokenStorage } from '@/features/auth/storage/token-storage';
import type { AuthTokens } from '@/features/auth/types/auth.types';

let accessToken: string | null = null;
let refreshPromise: Promise<boolean> | undefined;
let latestRefreshedToken: string | null = null;
let logoutPromise: Promise<void> | undefined;
let sessionVersion = 0;
let storageMutation = Promise.resolve();

const enqueueStorageMutation = async <T>(operation: () => Promise<T>) => {
  const result = storageMutation.then(operation, operation);
  storageMutation = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => refreshTokenStorage.get();

const persistSession = async (tokens: AuthTokens, expectedVersion?: number) => {
  if (
    logoutPromise ||
    (expectedVersion !== undefined && expectedVersion !== sessionVersion)
  ) {
    return false;
  }

  const writeVersion = ++sessionVersion;

  return enqueueStorageMutation(async () => {
    if (logoutPromise || writeVersion !== sessionVersion) {
      return false;
    }

    await refreshTokenStorage.set(tokens.refreshToken);

    if (logoutPromise || writeVersion !== sessionVersion) {
      return false;
    }

    accessToken = tokens.accessToken;
    return true;
  });
};

export const establishSession = async (tokens: AuthTokens) => {
  await persistSession(tokens);
};

export const clearSession = async () => {
  const clearVersion = ++sessionVersion;
  accessToken = null;
  latestRefreshedToken = null;

  await enqueueStorageMutation(async () => {
    if (clearVersion !== sessionVersion) {
      return;
    }

    await refreshTokenStorage.clear();
  });
};

const refreshStoredSession = async () => {
  const refreshVersion = sessionVersion;
  const refreshToken = await refreshTokenStorage.get();

  if (!refreshToken || logoutPromise || refreshVersion !== sessionVersion) {
    accessToken = null;
    return false;
  }

  try {
    const tokens = await authApi.refresh(refreshToken);
    latestRefreshedToken = tokens.refreshToken;
    const didPersist = await persistSession(tokens, refreshVersion);

    if (didPersist || !logoutPromise) {
      latestRefreshedToken = null;
    }

    return didPersist;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await clearSession();
      return false;
    }

    throw error;
  }
};

export const refreshSession = async () => {
  if (logoutPromise) {
    return false;
  }

  const pendingRefresh = (refreshPromise ??= refreshStoredSession());

  try {
    return await pendingRefresh;
  } finally {
    if (refreshPromise === pendingRefresh) {
      refreshPromise = undefined;
    }
  }
};

export const logoutSession = () => {
  if (logoutPromise) {
    return logoutPromise;
  }

  const pendingRefresh = refreshPromise;
  const logout = async () => {
    let refreshToken = await refreshTokenStorage.get();

    try {
      if (pendingRefresh) {
        try {
          await pendingRefresh;
        } catch {
          // The latest known token is still revoked when refresh fails.
        }
      }

      refreshToken = latestRefreshedToken ?? refreshToken;

      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } finally {
      latestRefreshedToken = null;
      await clearSession();
    }
  };

  logoutPromise = logout().finally(() => {
    logoutPromise = undefined;
  });

  return logoutPromise;
};

apiClient.setAuthHandler({
  getAccessToken,
  refreshSession,
});
