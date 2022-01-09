import { useMutation } from 'react-query';
import { createStockItem, StockItem, updateStockItem } from '../api/BasilApi';

export const useUpsertStockItem = () => {
  const createMutation = useMutation(createStockItem);
  const updateMutation = useMutation((stockItem: Partial<StockItem>) =>
    updateStockItem(stockItem.id, stockItem),
  );
  const upsertStockItem = (stockItem: Partial<StockItem>) => {
    if (!stockItem?.id) {
      return createMutation.mutateAsync(stockItem);
    }
    return updateMutation.mutateAsync(stockItem);
  };
  return {
    upsertStockItem,
  };
};
