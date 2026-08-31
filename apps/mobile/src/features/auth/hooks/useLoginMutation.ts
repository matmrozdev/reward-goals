import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuth } from '@/providers/AuthProvider';
import type { AuthCredentials } from '@/features/auth/types/auth.types';

export const useLoginMutation = () => {
  const { authenticate } = useAuth();
  const credentialsRef = useRef<AuthCredentials | null>(null);
  const mutation = useMutation({
    mutationFn: async () => {
      const credentials = credentialsRef.current;

      if (!credentials) {
        throw new Error('Login credentials are required.');
      }

      const session = await authApi.login(credentials);
      await authenticate(session);

      return session.user;
    },
    onSettled: () => {
      credentialsRef.current = null;
    },
  });

  const login = (credentials: AuthCredentials) => {
    if (credentialsRef.current) {
      return;
    }

    credentialsRef.current = credentials;
    mutation.mutate();
  };

  return { ...mutation, login };
};
