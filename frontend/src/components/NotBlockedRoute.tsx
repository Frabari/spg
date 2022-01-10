import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export const NotBlockedRoute = ({ children }: PropsWithChildren<{}>) => {
  const { data: profile, isLoading, error } = useProfile();
  if (isLoading) {
    return null;
  }
  if (profile.blockedAt != null) {
    return <Navigate to="/blocked" />;
  }
  return <>{children}</>;
};
