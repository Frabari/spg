import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { getGlobalState } from '../App';

export const ProtectedRoute = ({ children }: PropsWithChildren<{}>) => {
  const user = getGlobalState('user');
  return user === null ? null : user === false ? (
    <Navigate to="/login" />
  ) : (
    <>{children}</>
  );
};
