import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ApiError } from '@/api/errors';

import {
  authKeys,
  currentUserQueryOptions,
} from '@/features/auth/api/auth.queries';
import {
  clearSession,
  establishSession,
  refreshSession,
} from '@/features/auth/session/auth-session';
import type { AuthSession, AuthUser } from '@/features/auth/types/auth.types';

type AuthStatus =
  'authenticated' | 'restoring' | 'restore-error' | 'unauthenticated';

type AuthContextValue = {
  authenticate: (session: AuthSession) => Promise<void>;
  clearAuthentication: () => Promise<void>;
  isUserLoading: boolean;
  retryCurrentUser: () => Promise<void>;
  retryRestore: () => Promise<void>;
  restoreError: string | null;
  status: AuthStatus;
  user: AuthUser | null;
  userError: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const didStartRestore = useRef(false);
  const currentUserQuery = useQuery({
    ...currentUserQueryOptions(),
    enabled: status === 'authenticated',
  });

  const restore = useCallback(async () => {
    setRestoreError(null);
    setStatus('restoring');

    try {
      const isAuthenticated = await refreshSession();
      setStatus(isAuthenticated ? 'authenticated' : 'unauthenticated');
    } catch (error) {
      const apiError = ApiError.fromUnknown(error);
      setRestoreError(apiError.message);
      setStatus('restore-error');
    }
  }, []);

  useEffect(() => {
    if (didStartRestore.current) {
      return;
    }

    didStartRestore.current = true;
    void restore();
  }, [restore]);

  useEffect(() => {
    if (
      status !== 'authenticated' ||
      !(currentUserQuery.error instanceof ApiError) ||
      currentUserQuery.error.status !== 401
    ) {
      return;
    }

    void clearSession().finally(() => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      setStatus('unauthenticated');
    });
  }, [currentUserQuery.error, queryClient, status]);

  const authenticate = useCallback(
    async (session: AuthSession) => {
      await establishSession(session);
      queryClient.setQueryData(authKeys.me(), session.user);
      setRestoreError(null);
      setStatus('authenticated');
    },
    [queryClient],
  );

  const clearAuthentication = useCallback(async () => {
    await clearSession();
    queryClient.removeQueries();
    setRestoreError(null);
    setStatus('unauthenticated');
  }, [queryClient]);

  const retryCurrentUser = useCallback(async () => {
    await currentUserQuery.refetch();
  }, [currentUserQuery]);

  const currentUserError = currentUserQuery.error
    ? ApiError.fromUnknown(currentUserQuery.error)
    : null;
  const userError =
    status === 'authenticated' && currentUserError?.status !== 401
      ? (currentUserError?.message ?? null)
      : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      authenticate,
      clearAuthentication,
      isUserLoading: status === 'authenticated' && currentUserQuery.isPending,
      retryCurrentUser,
      restoreError,
      retryRestore: restore,
      status,
      user: currentUserQuery.data ?? null,
      userError,
    }),
    [
      authenticate,
      clearAuthentication,
      currentUserQuery.data,
      currentUserQuery.isPending,
      retryCurrentUser,
      restore,
      restoreError,
      status,
      userError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
};
