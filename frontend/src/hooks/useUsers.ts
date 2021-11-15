import { useContext, useEffect, useState } from 'react';
import { getUsers, User } from '../api/BasilApi';
import { PendingStateContext } from '../contexts/pending';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

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
