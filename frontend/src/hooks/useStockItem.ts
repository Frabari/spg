import { useQuery } from 'react-query';
import { getStockItem, ProductId } from '../api/BasilApi';

export const STOCK_ITEM_QUERY = 'stock-item';

export const useStockItem = (id?: ProductId) => {
  return useQuery([STOCK_ITEM_QUERY, id], () => getStockItem(id));
};
