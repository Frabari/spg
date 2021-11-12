import { useContext, useEffect, useState } from 'react';
import { PendingStateContext } from '../contexts/pending';
import { createUser, getUser, User, UserId } from '../api/basil-api';

export const useUser = (id?: UserId) => {
  const { setPending } = useContext(PendingStateContext);
  const [user, setUser] = useState<User>(null);

  const upsertUser = (user: Partial<User>) => {
    if (!user.id) {
      setPending(true);
      createUser(user)
        .then(setUser)
        .finally(() => setPending(false));
    }
  };

  useEffect(() => {
    if (id) {
      setPending(true);
      getUser(id)
        .then(setUser)
        .finally(() => setPending(false));
    }
  }, [id, setPending]);
  return [user, upsertUser];
};
