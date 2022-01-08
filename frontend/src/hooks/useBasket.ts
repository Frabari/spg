import { useQuery } from 'react-query';
import { getBasket } from '../api/BasilApi';

export const useBasket = () => {
  return useQuery('basket', getBasket);
};
