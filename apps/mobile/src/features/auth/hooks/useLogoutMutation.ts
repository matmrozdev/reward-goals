import { useMutation } from '@tanstack/react-query';

import { logoutSession } from '@/features/auth/auth-session';
import { useAuth } from '@/features/auth/AuthProvider';

export const useLogoutMutation = () => {
  const { clearAuthentication } = useAuth();

  return useMutation({
    mutationFn: logoutSession,
    onSettled: clearAuthentication,
  });
};
