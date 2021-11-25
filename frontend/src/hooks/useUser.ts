import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createUser, getUser, User, UserId } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { PendingStateContext } from '../contexts/pending';

export const useUser = (id?: UserId) => {
  const { setPending } = useContext(PendingStateContext);
  const [user, setUser] = useState<User>(null);
  const [error, setError] = useState<ApiException>(null);

  const upsertUser = (user: Partial<User>) => {
    if (!user?.id) {
      setPending(true);
      return createUser(user)
        .then(u => {
          setUser(u);
          return u;
        })
        .catch(e => {
          setError(e);
          toast.error(e.message);
          throw e;
        })
        .finally(() => setPending(false));
    }
  };

  const load = useRef<() => void>();
  load.current = () => {
    if (id) {
      setPending(true);
      getUser(id)
        .then(setUser)
        .catch(e => {
          setError(e);
          toast.error(e.message);
          throw e;
        })
        .finally(() => setPending(false));
    }
  };

  useEffect(() => {
    load.current();
  }, [id, setPending, load]);

  return { load: load.current, user, upsertUser, error };
};
