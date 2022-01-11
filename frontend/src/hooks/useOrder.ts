import { useQuery } from 'react-query';
import { getOrder, OrderId } from '../api/BasilApi';

export const ORDER_QUERY = 'order';

export const useOrder = (id?: OrderId) => {
  return useQuery([ORDER_QUERY, id], () => getOrder(id));
};
