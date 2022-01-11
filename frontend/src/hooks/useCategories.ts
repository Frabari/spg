import { useQuery } from 'react-query';
import { getCategories } from '../api/BasilApi';

const CATEGORIES_QUERY = 'categories';

export const useCategories = () => {
  return useQuery(CATEGORIES_QUERY, getCategories, {
    initialData: [],
  });
};
