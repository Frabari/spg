import { useEffect, useRef, useState } from 'react';
import { Constraints, getMe, User } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { useGlobalState } from './useGlobalState';
import { usePendingState } from './usePendingState';

export const useProfile = () => {
  const { setPending: setGlobalPending } = usePendingState();
  const [pending, setPending] = useGlobalState('profilePending');
  const [profile, setProfile] = useGlobalState('profile');
  const [error, setError] = useState<ApiException<Constraints<User>>>(null);

  useEffect(() => {
    setGlobalPending(pending);
  }, [pending, setGlobalPending]);

  const upsertProfile = (user: Partial<User>) => {
    if (user?.id) {
      // TODO: update profile
    }
  };

  const load = useRef<() => void>();
  load.current = () => {
    setPending(true);
    getMe()
      .then(setProfile)
      .catch(e => {
        setError(e);
        setProfile(false);
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    if (!pending && profile === null) {
      load.current();
    }
  }, [pending, profile]);

  return { load: load.current, profile, upsertProfile, pending, error };
};
