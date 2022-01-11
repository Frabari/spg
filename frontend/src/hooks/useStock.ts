import { useQuery } from 'react-query';
import { getStock } from '../api/BasilApi';

export const STOCK_QUERY = 'stock';

export const useStock = () => {
  return useQuery(STOCK_QUERY, getStock, {
    initialData: [],
  });
};
