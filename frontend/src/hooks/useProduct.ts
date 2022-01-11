import { useQuery } from 'react-query';
import { getProduct, ProductId } from '../api/BasilApi';

export const PRODUCT_QUERY = 'product';

export const useProduct = (id?: ProductId) => {
  return useQuery([PRODUCT_QUERY, id], () => getProduct(id));
};
