import { useQuery } from 'react-query';
import { DateTime } from 'luxon';
import { getDate } from '../api/BasilApi';

export const useDate = () => {
  return useQuery('date', getDate, {
    initialData: DateTime.now(),
  });
};
