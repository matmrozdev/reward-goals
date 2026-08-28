import { ApiError } from '@/api/errors';

import { getLoginErrorMessage } from './get-login-error-message';

describe('getLoginErrorMessage', () => {
  it('returns the detailed API message in development', () => {
    const error = new ApiError('Detailed server failure', { status: 500 });

    const message = getLoginErrorMessage(error, true);

    expect(message).toBe('Detailed server failure');
  });

  it('returns an ambiguous credentials message for unauthorized responses', () => {
    const error = new ApiError('Invalid email or password', { status: 401 });

    const message = getLoginErrorMessage(error, false);

    expect(message).toBe('The email or password is incorrect.');
  });

  it('returns a generic production message when the server does not respond', () => {
    const error = new TypeError('Network request failed');

    const message = getLoginErrorMessage(error, false);

    expect(message).toBe('Something went wrong. Please try again.');
  });

  it('returns a generic production message for other server failures', () => {
    const error = new ApiError('Database connection failed', { status: 500 });

    const message = getLoginErrorMessage(error, false);

    expect(message).toBe('Something went wrong. Please try again.');
  });
});
