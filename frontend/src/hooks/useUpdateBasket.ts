import { useMutation, useQueryClient } from 'react-query';
import {
  NotificationType,
  Order,
  Product,
  updateBasket,
} from '../api/BasilApi';
import { useBasket } from './useBasket';
import { useNotifications } from './useNotifications';

export const useUpdateBasket = () => {
  const client = useQueryClient();
  const { data: basket } = useBasket();
  const { enqueueNotification } = useNotifications();
  const mutation = useMutation(updateBasket);

  const showErrorMessage = () => {
    enqueueNotification({
      type: NotificationType.ERROR,
      title: 'Basket error',
      message: 'There was an error while updating the basket',
    });
  };

  const upsertEntry = (product: Product, quantity: number) => {
    const dto = { ...(basket as Order) };
    if (!dto.entries) {
      dto.entries = [];
    }
    const existingEntry = dto.entries.find(e => e.product.id === product.id);
    if (existingEntry) {
      if (quantity === 0) {
        dto.entries = dto.entries.filter(e => e !== existingEntry);
      } else {
        existingEntry.quantity += quantity;
      }
    } else {
      dto.entries.push({
        product,
        quantity,
      });
    }
    return mutation
      .mutateAsync(dto, {
        onSuccess() {
          return client.invalidateQueries('products');
        },
      })
      .catch(() => {
        showErrorMessage();
      });
  };
  const deleteEntry = (product: Product) => {
    const dto = { ...(basket as Order) };
    if (!dto.entries) {
      return;
    }
    const existingEntry = dto.entries.find(e => e.product.id === product.id);
    if (existingEntry) {
      dto.entries = dto.entries.filter(e => e.product.id !== product.id);
    }
    return mutation
      .mutateAsync(dto, {
        onSuccess() {
          return client.invalidateQueries('products');
        },
      })
      .catch(() => {
        showErrorMessage();
      });
  };

  return {
    ...mutation,
    upsertEntry,
    deleteEntry,
  };
};
