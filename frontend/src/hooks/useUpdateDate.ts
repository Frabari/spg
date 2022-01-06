import { useMutation, useQueryClient } from 'react-query';
import { Settings } from 'luxon';
import { setDate } from '../api/BasilApi';

export const useUpdateDate = () => {
  const client = useQueryClient();
  return useMutation(setDate, {
    onSuccess(date) {
      Settings.now = () => date.toMillis();
      return client.resetQueries();
    },
  });
};
