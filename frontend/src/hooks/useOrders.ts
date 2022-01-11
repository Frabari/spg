import { useQuery } from 'react-query';
import { getOrders } from '../api/BasilApi';

export const ORDERS_QUERY = 'orders';

export const useOrders = () => {
  return useQuery(ORDERS_QUERY, getOrders);
};
