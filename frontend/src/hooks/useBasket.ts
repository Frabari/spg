import { useQuery } from 'react-query';
import { getBasket } from '../api/BasilApi';

export const BASKET_QUERY = 'basket';

export const useBasket = () => {
  return useQuery(BASKET_QUERY, getBasket);
};
