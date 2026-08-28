import { ApiError } from '@/api/errors';

const invalidCredentialsMessage = 'The email or password is incorrect.';
const genericErrorMessage = 'Something went wrong. Please try again.';

export const getLoginErrorMessage = (
  error: unknown,
  isDevelopment = __DEV__,
) => {
  const apiError = ApiError.fromUnknown(error);

  if (isDevelopment) {
    return apiError.message;
  }

  if (apiError.status === 401) {
    return invalidCredentialsMessage;
  }

  return genericErrorMessage;
};
