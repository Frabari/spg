import { useMutation, useQueryClient } from 'react-query';
import { login } from '../api/BasilApi';
import { PROFILE_QUERY } from './useProfile';

export const useLogin = () => {
  const client = useQueryClient();
  return useMutation(
    ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    {
      onSuccess() {
        return client.invalidateQueries(PROFILE_QUERY);
      },
    },
  );
};
