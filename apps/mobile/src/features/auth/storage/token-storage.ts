import { secureStorage } from '@/storage/secure-storage';

const REFRESH_TOKEN_KEY = 'reward-goals.auth.refresh-token';

export const refreshTokenStorage = {
  clear: () => secureStorage.removeItem(REFRESH_TOKEN_KEY),
  get: () => secureStorage.getItem(REFRESH_TOKEN_KEY),
  set: (refreshToken: string) =>
    secureStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
};
