import { useQuery } from 'react-query';
import { getStockItem, ProductId } from '../api/BasilApi';

export const useStockItem = (id?: ProductId) => {
  return useQuery(['stock-item', id], () => getStockItem(id));
};
