import { useMutation } from 'react-query';
import { createOrder, Order, updateOrder } from '../api/BasilApi';

export const useUpsertOrder = () => {
  const createMutation = useMutation(createOrder);
  const updateMutation = useMutation((order: Partial<Order>) =>
    updateOrder(order.id, order),
  );
  const upsertOrder = (order: Partial<Order>) => {
    if (!order?.id) {
      return createMutation.mutateAsync(order);
    }
    return updateMutation.mutateAsync(order);
  };
  return {
    upsertOrder,
  };
};
