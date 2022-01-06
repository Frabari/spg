import { useMutation, useQueryClient } from 'react-query';
import { Order, Product, updateBasket } from '../api/BasilApi';
import { useBasket } from './useBasket';

export const useUpdateBasket = () => {
  const client = useQueryClient();
  const { data: basket } = useBasket();
  const mutation = useMutation(updateBasket);

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
    return mutation.mutateAsync(dto, {
      onSuccess() {
        return client.invalidateQueries('products');
      },
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
    return mutation.mutateAsync(dto, {
      onSuccess() {
        return client.invalidateQueries('products');
      },
    });
  };

  return {
    ...mutation,
    upsertEntry,
    deleteEntry,
  };
};
