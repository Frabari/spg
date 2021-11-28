import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getUsers, User } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useUsers = () => {
  const { setPending } = usePendingState();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<ApiException>(null);
  useEffect(() => {
    setPending(true);
    getUsers()
      .then(setUsers)
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  }, [setPending]);
  return { users, error };
};
