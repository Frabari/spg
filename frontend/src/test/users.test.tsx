import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { User } from '../api/BasilApi';
import { useUser } from '../hooks/useUser';
import { useUsers } from '../hooks/useUsers';

// @ts-ignore
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

test('create user', async () => {
  const user: Partial<User> = {
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@rossi.com',
    password: 'mariorossi',
  };

  const { result } = renderHook(() => useUser(), { wrapper });
  await act(async () =>
    expect((await result.current.upsertUser(user)).email).toEqual(
      'mario@rossi.com',
    ),
  );
});

test('get users', async () => {
  const { result } = renderHook(() => useUsers(), { wrapper });
  await waitFor(() =>
    expect(result.current.users.find(u => u.id === 31).name).toEqual('Luigi'),
  );
});
