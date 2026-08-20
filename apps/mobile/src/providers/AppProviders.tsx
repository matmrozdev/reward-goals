import { PropsWithChildren } from 'react';

import { AuthProvider } from '@/features/auth/AuthProvider';

import { QueryProvider } from './QueryProvider';

export const AppProviders = ({ children }: PropsWithChildren) => (
  <QueryProvider>
    <AuthProvider>{children}</AuthProvider>
  </QueryProvider>
);
