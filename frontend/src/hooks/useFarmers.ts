import { useQuery } from 'react-query';
import { getFarmers } from '../api/BasilApi';

export const FARMERS_QUERY = 'farmers';

export const useFarmers = () => {
  return useQuery(FARMERS_QUERY, getFarmers, {
    initialData: [],
  });
};
