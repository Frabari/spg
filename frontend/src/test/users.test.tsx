import { act, renderHook } from '@testing-library/react-hooks';
import { BrowserRouter as Router } from 'react-router-dom';
import { User } from '../api/BasilApi';
import { PendingStateContext } from '../contexts/pending';
import { UserContext } from '../contexts/user';
import { useUser } from '../hooks/useUser';

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

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getUser: () => Promise.resolve(mockUser),
    createUser: (_user: Partial<User>) => Promise.resolve(_user),
  };
});

test('create user', async () => {
  const user: Partial<User> = {
    name: 'Mario',
    surname: 'Rossi',
    email: 'mario@rossi.com',
    password: 'mariorossi',
  };
  // @ts-ignore
  const wrapper = ({ children }) => (
    <Router>
      <PendingStateContext.Provider
        value={{ pending: true, setPending: (value: boolean) => true }}
      >
        <UserContext.Provider
          value={{ user: false, setUser: (value: false | User) => user }}
        >
          {children}
        </UserContext.Provider>
      </PendingStateContext.Provider>
    </Router>
  );

  const { result } = renderHook(() => useUser(), { wrapper });
  await act(async () =>
    expect((await result.current.upsertUser(user)).email).toEqual(
      'mario@rossi.com',
    ),
  );
});
