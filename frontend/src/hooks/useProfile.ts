import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getMe } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { useGlobalState } from '../index';
import { usePendingState } from './usePendingState';

export const useProfile = () => {
  const { setPending } = usePendingState();
  const [profile, setProfile] = useGlobalState('profile');
  const [error, setError] = useState<ApiException>(null);

  const load = useRef<() => void>();
  load.current = () => {
    setPending(true);
    getMe()
      .then(setProfile)
      .catch(e => {
        setError(e);
        toast.error(e.message);
        throw e;
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    load.current();
  }, [setPending, load]);

  return { load: load.current, profile, error };
};
