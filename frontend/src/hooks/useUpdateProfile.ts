import { useMutation, useQueryClient } from 'react-query';
import { updateMe } from '../api/BasilApi';

export const useUpdateProfile = () => {
  const client = useQueryClient();
  return useMutation(updateMe, {
    onSuccess(profile) {
      client.setQueryData('profile', profile);
    },
  });
};
