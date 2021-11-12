import { createContext } from 'react';
import { User } from '../api/basil-api';

export const UserContext =
  createContext<{ user: User | false; setUser: (value: User | false) => void }>(
    null,
  );
