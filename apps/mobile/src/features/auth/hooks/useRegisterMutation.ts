import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { authApi } from '@/features/auth/api/auth.api';
import type { AuthCredentials } from '@/features/auth/types/auth.types';

type RegisterOptions = {
  onSuccess: () => void;
};

export const useRegisterMutation = () => {
  const credentialsRef = useRef<AuthCredentials | null>(null);
  const mutation = useMutation({
    mutationFn: async () => {
      const credentials = credentialsRef.current;

      if (!credentials) {
        throw new Error('Registration credentials are required.');
      }

      return authApi.register(credentials);
    },
    onSettled: () => {
      credentialsRef.current = null;
    },
  });

  const register = (credentials: AuthCredentials, options: RegisterOptions) => {
    if (credentialsRef.current) {
      return;
    }

    credentialsRef.current = credentials;
    mutation.mutate(undefined, { onSuccess: options.onSuccess });
  };

  return { ...mutation, register };
};
