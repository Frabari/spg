import { useQuery } from 'react-query';
import { getUser, UserId } from '../api/BasilApi';

export const useUser = (id?: UserId) => {
  return useQuery(['user', id], () => getUser(id));
};
