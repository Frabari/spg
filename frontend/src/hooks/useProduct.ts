import { useQuery } from 'react-query';
import { getProduct, ProductId } from '../api/BasilApi';

export const useProduct = (id?: ProductId) => {
  return useQuery(['product', id], () => getProduct(id));
};
