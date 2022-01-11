import { useQuery } from 'react-query';
import { getOrder, OrderId } from '../api/BasilApi';

export const useOrder = (id?: OrderId) => {
  return useQuery(['order', id], () => getOrder(id));
};
