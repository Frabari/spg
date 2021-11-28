import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { User } from '../api/BasilApi';
import { useUser } from '../hooks/useUser';
import { useUsers } from '../hooks/useUsers';

jest.mock('../api/BasilApi', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../api/BasilApi');
  const mockUser: Partial<User> = {
    id: 30,
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@rossi.com',
    password: 'mariorossi',
  };
  const mockUsers = [
    {
      id: 30,
      name: 'Mario',
    },
    {
      id: 31,
      name: 'Luigi',
    },
  ];

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getUser: () => Promise.resolve(mockUser),
    createUser: (_user: Partial<User>) => Promise.resolve(_user),
    getUsers: () => Promise.resolve(mockUsers),
  };
});

test('create user', async () => {
  const user: Partial<User> = {
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@rossi.com',
    password: 'mariorossi',
  };

  const { result } = renderHook(() => useUser());
  await act(async () =>
    expect((await result.current.upsertUser(user)).email).toEqual(
      'mario@rossi.com',
    ),
  );
});

test('get users', async () => {
  const { result } = renderHook(() => useUsers());
  await waitFor(() =>
    expect(result.current.users.find(u => u.id === 31).name).toEqual('Luigi'),
  );
});
