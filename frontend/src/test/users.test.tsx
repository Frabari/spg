import './BasilApi.mock';
import { act, renderHook } from '@testing-library/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import { User } from '../api/BasilApi';
import { useUpsertUser } from '../hooks/useUpsertUser';
import { useUser } from '../hooks/useUser';
import { useUsers } from '../hooks/useUsers';

// @ts-ignore
const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

test('get user', async () => {
  const { result, waitFor } = renderHook(() => useUser(1), { wrapper });
  await waitFor(() =>
    expect(result.current.data.email).toEqual('mario@rossi.com'),
  );
});

const user: Partial<User> = {
  name: 'Mario',
  surname: 'Rossi',
  email: 'mario@rossi.com',
  password: 'mariorossi',
};

test('create user', async () => {
  const { result } = renderHook(() => useUpsertUser(), { wrapper });
  await act(async () =>
    expect((await result.current.upsertUser(user)).email).toEqual(
      'mario@rossi.com',
    ),
  );
});

test('update user', async () => {
  const { result } = renderHook(() => useUpsertUser(), { wrapper });
  await act(async () =>
    expect((await result.current.upsertUser({ id: 1, ...user })).email).toEqual(
      'mario@rossi.com',
    ),
  );
});

test('get users', async () => {
  const { result, waitFor } = renderHook(() => useUsers(), { wrapper });
  await waitFor(() =>
    expect(result.current.data.find(u => u.id === 31).name).toEqual('Luigi'),
  );
});
