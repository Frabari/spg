import { useQuery } from 'react-query';
import { getMe } from '../api/BasilApi';

export const useProfile = () => {
  return useQuery('profile', getMe);
};
