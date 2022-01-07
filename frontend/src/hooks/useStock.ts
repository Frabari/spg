import { useQuery } from 'react-query';
import { getStock } from '../api/BasilApi';

export const useStock = () => {
  return useQuery('stock', getStock, {
    initialData: [],
  });
};
