import { useQuery } from 'react-query';
import {
  Constraints,
  getOrder,
  Order,
  OrderEntry,
  OrderId,
} from '../api/BasilApi';

export type OrderConstraints = Constraints<Omit<Order, 'entries'>> & {
  entries: Record<number, Constraints<OrderEntry>>;
};

export const useOrder = (id?: OrderId) => {
  return useQuery(['order', id], () => getOrder(id));
};
