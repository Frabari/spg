import { useQuery } from 'react-query';
import { getMe } from '../api/BasilApi';

export const PROFILE_QUERY = 'profile';

export const useProfile = () => {
  return useQuery(PROFILE_QUERY, getMe);
};
