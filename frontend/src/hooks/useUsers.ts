import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getUsers, User } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { PendingStateContext } from '../contexts/pending';

export const useUsers = () => {
  const { setPending } = useContext(PendingStateContext);
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
