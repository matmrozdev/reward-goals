import { useMutation } from '@tanstack/react-query';

import { logoutSession } from '@/features/auth/session/auth-session';
import { useAuth } from '@/providers/AuthProvider';

export const useLogoutMutation = () => {
  const { clearAuthentication } = useAuth();

  return useMutation({
    mutationFn: logoutSession,
    onSettled: clearAuthentication,
  });
};
