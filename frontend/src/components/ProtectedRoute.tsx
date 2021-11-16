import { PropsWithChildren, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/user';

export const ProtectedRoute = ({ children }: PropsWithChildren<{}>) => {
  const { user } = useContext(UserContext);
  return user === null ? null : user === false ? (
    <Navigate to="/login" />
  ) : (
    <>{children}</>
  );
};
