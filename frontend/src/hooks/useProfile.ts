import { useEffect, useRef, useState } from 'react';
import { getMe } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { useGlobalState } from './useGlobalState';
import { usePendingState } from './usePendingState';

export const useProfile = () => {
  const { setPending: setGlobalPending } = usePendingState();
  const [pending, setPending] = useGlobalState('profilePending');
  const [profile, setProfile] = useGlobalState('profile');
  const [error, setError] = useState<ApiException>(null);

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
    setGlobalPending(pending);
  }, [pending, setGlobalPending]);

  useEffect(() => {
    if (!pending && profile === null) {
      console.log(
        'Loading profile because !pending',
        !pending,
        ' && profile === null',
        profile === null,
      );
      load.current();
    }
  }, [pending, profile]);

  return { load: load.current, profile, pending, error };
};
