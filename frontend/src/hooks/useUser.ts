import { useContext, useEffect, useState } from 'react';
import { PendingStateContext } from '../contexts/pending';
import { createUser, getUser, User, UserId } from '../api/basil-api';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

export const useUser = (id?: UserId) => {
  const { setPending } = useContext(PendingStateContext);
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<ApiException>(null);

  const upsertUser = (user: Partial<User>) => {
    if (!user.id) {
      setPending(true);
      return createUser(user)
        .then(u => {
          setUser(u);
          return u;
        })
        .catch(e => {
          setError(e);
          toast.error(e.message);
        })
        .finally(() => setPending(false));
    }
  };

  useEffect(() => {
    if (id) {
      setPending(true);
      getUser(id)
        .then(setUser)
        .catch(e => {
          setError(e);
          toast.error(e.message);
        })
        .finally(() => setPending(false));
    }
  }, [id, setPending]);
  return { user, upsertUser, error };
};
