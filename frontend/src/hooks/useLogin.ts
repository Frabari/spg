import { useMutation, useQueryClient } from 'react-query';
import { login } from '../api/BasilApi';

export const useLogin = () => {
  const client = useQueryClient();
  return useMutation(
    ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    {
      onSuccess() {
        return client.invalidateQueries('profile');
      },
    },
  );
};
