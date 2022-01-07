import { useQuery } from 'react-query';
import { getCategories } from '../api/BasilApi';

export const useCategories = () => {
  return useQuery('categories', getCategories, {
    initialData: [],
  });
};
