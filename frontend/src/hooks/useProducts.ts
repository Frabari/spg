import { useQuery } from 'react-query';
import { getProducts } from '../api/BasilApi';

export const PRODUCTS_QUERY = 'products';

export const useProducts = () => {
  return useQuery(PRODUCTS_QUERY, getProducts);
};
