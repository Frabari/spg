import { useMutation, useQueryClient } from 'react-query';
import { updateMe } from '../api/BasilApi';
import { PROFILE_QUERY } from './useProfile';

export const useUpdateProfile = () => {
  const client = useQueryClient();
  return useMutation(updateMe, {
    onSuccess(profile) {
      client.setQueryData(PROFILE_QUERY, profile);
    },
  });
};
