import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';

export const ProtectedRoute = ({ children }: PropsWithChildren<{}>) => {
  const { isLoading, error } = useProfile();
  return isLoading ? null : error ? <Navigate to="/login" /> : <>{children}</>;
};
