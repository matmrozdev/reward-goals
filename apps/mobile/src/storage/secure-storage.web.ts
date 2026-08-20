const sessionStorage = new Map<string, string>();

// Web sessions intentionally live only in memory. Closing or reloading the tab
// requires signing in again; browser storage is not used for refresh tokens.
export const secureStorage = {
  getItem: async (key: string) => sessionStorage.get(key) ?? null,
  removeItem: async (key: string) => {
    sessionStorage.delete(key);
  },
  setItem: async (key: string, value: string) => {
    sessionStorage.set(key, value);
  },
};
