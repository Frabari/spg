import { useEffect, useRef, useState } from 'react';
import { getMe, updateMe, User, Constraints } from '../api/BasilApi';
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

  const load = useRef<() => void>();
  load.current = () => {
    setPending(true);
    getMe()
      .then(setProfile)
      .catch(e => {
        setError(e);
        setProfile(false);
        throw e;
      })
      .finally(() => setPending(false));
  };

  const updateProfile = (dto: Partial<User>) => {
    setPending(true);
    return updateMe(dto)
      .then(u => {
        setProfile(u);
        return u;
      })
      .catch(e => {
        setError(e);
        throw e;
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    if (!pending && profile === null) {
      load.current();
    }
  }, [pending, profile]);

  return {
    profile,
    load: load.current,
    updateProfile,
    pending,
    error,
  };
};
