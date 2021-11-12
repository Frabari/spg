import { useContext, useEffect, useState } from 'react';
import { getUsers, User } from '../api/basil-api';
import { PendingStateContext } from '../contexts/pending';

export const useUsers = () => {
  const { setPending } = useContext(PendingStateContext);
  const [users, setUsers] = useState<User[]>(null);
  useEffect(() => {
    setPending(true);
    getUsers()
      .then(setUsers)
      .finally(() => setPending(false));
  }, [setPending]);
  return users;
};
