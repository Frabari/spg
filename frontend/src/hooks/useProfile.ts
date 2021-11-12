import { useContext, useEffect, useState } from 'react';
import { getMe, User } from '../api/basil-api';
import { PendingStateContext } from '../contexts/pending';

export const useProfile = () => {
  const { setPending } = useContext(PendingStateContext);
  const [profile, setProfile] = useState<User>(null);
  useEffect(() => {
    setPending(true);
    getMe()
      .then(setProfile)
      .catch(() => setProfile({} as User))
      .finally(() => setPending(false));
  }, [setPending]);
  return profile;
};
