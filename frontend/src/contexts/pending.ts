import { createContext } from 'react';

export const PendingStateContext =
  createContext<{ pending: boolean; setPending: (value: boolean) => void }>(
    null,
  );
