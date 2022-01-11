import { useMutation, useQueryClient } from 'react-query';
import { createOrder, Order, updateOrder } from '../api/BasilApi';
import { ORDER_QUERY } from './useOrder';

export const useUpsertOrder = () => {
  const client = useQueryClient();
  const createMutation = useMutation(createOrder);
  const updateMutation = useMutation((order: Partial<Order>) =>
    updateOrder(order.id, order),
  );
  const upsertOrder = (order: Partial<Order>) => {
    if (!order?.id) {
      return createMutation.mutateAsync(order);
    }
    return updateMutation.mutateAsync(order).then(updatedOrder => {
      client.setQueryData([ORDER_QUERY, updatedOrder.id], updatedOrder);
      return updatedOrder;
    });
  };
  return {
    upsertOrder,
  };
};
