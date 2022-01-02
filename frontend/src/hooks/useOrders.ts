import { useQuery } from 'react-query';
import { getOrders } from '../api/BasilApi';

export const useOrders = () => {
  return useQuery('orders', getOrders);
};
