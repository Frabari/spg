import { useQuery } from 'react-query';
import { getFarmers } from '../api/BasilApi';

export const useFarmers = () => {
  return useQuery('farmers', getFarmers, {
    initialData: [],
  });
};
