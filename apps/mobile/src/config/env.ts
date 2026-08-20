const getApiUrl = () => {
  const value = process.env.EXPO_PUBLIC_API_URL;

  if (!value) {
    throw new Error('EXPO_PUBLIC_API_URL is required.');
  }

  try {
    const url = new URL(value);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Unsupported protocol.');
    }

    return url.toString().replace(/\/$/, '');
  } catch {
    throw new Error('EXPO_PUBLIC_API_URL must be a valid HTTP(S) URL.');
  }
};

export const env = {
  apiUrl: getApiUrl(),
} as const;
