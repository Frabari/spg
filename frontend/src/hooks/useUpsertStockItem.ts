import { useMutation, useQueryClient } from 'react-query';
import { createStockItem, StockItem, updateStockItem } from '../api/BasilApi';
import { STOCK_ITEM_QUERY } from './useStockItem';

export const useUpsertStockItem = () => {
  const client = useQueryClient();
  const createMutation = useMutation(createStockItem);
  const updateMutation = useMutation((stockItem: Partial<StockItem>) =>
    updateStockItem(stockItem.id, stockItem),
  );
  const upsertStockItem = (stockItem: Partial<StockItem>) => {
    if (!stockItem?.id) {
      return createMutation.mutateAsync(stockItem);
    }
    return updateMutation.mutateAsync(stockItem).then(updatedStockItem => {
      client.setQueryData(
        [STOCK_ITEM_QUERY, updatedStockItem.id],
        updatedStockItem,
      );
      return updatedStockItem;
    });
  };
  return {
    upsertStockItem,
  };
};
