import { useMutation, useQueryClient } from 'react-query';
import {
  OrderEntry,
  ProductId,
  updateProductOrderEntries,
} from '../api/BasilApi';

export const useUpdateProductOrderEntries = () => {
  const client = useQueryClient();
  return useMutation(
    ({ productId, dto }: { productId: ProductId; dto: Partial<OrderEntry> }) =>
      updateProductOrderEntries(productId, dto),
    {
      onSuccess() {
        return client.invalidateQueries('stock');
      },
    },
  );
};
