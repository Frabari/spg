import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export const ProtectedRoute = ({ children }: PropsWithChildren<{}>) => {
  const { profile } = useProfile();
  return profile === null ? null : profile === false ? (
    <Navigate to="/login" />
  ) : (
    <>{children}</>
  );
};
