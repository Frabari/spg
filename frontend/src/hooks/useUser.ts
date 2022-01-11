import { useQuery } from 'react-query';
import { getUser, UserId } from '../api/BasilApi';

export const USER_QUERY = 'user';

export const useUser = (id?: UserId) => {
  return useQuery([USER_QUERY, id], () => getUser(id));
};
