import { useQuery } from 'react-query';
import { getUsers } from '../api/BasilApi';

export const useUsers = () => {
  return useQuery('users', getUsers, {
    initialData: [],
  });
};
