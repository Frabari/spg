import { useQuery } from 'react-query';
import { DateTime } from 'luxon';
import { getDate } from '../api/BasilApi';

export const DATE_QUERY = 'date';

export const useDate = () => {
  return useQuery(DATE_QUERY, getDate, {
    initialData: DateTime.now(),
  });
};
