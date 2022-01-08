import { useQuery } from 'react-query';
import { getProducts } from '../api/BasilApi';

export const useProducts = () => {
  return useQuery('products', getProducts);
};
