import { useQuery } from 'react-query';
import { getUsers } from '../api/BasilApi';

export const USERS_QUERY = 'users';

export const useUsers = () => {
  return useQuery(USERS_QUERY, getUsers, {
    initialData: [],
  });
};
