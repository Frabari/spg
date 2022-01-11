import { useMutation, useQueryClient } from 'react-query';
import { logout } from '../api/BasilApi';

export const useLogout = () => {
  const client = useQueryClient();
  return useMutation(logout, {
    onSuccess() {
      return client.resetQueries();
    },
  });
};
