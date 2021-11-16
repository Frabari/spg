import {Role, User} from "../api/BasilApi";
import {PendingStateContext} from "../contexts/pending";
import {useUser} from "../hooks/useUser"
import {renderHook, act} from '@testing-library/react-hooks'
import {useEffect} from "react";
import {UserContext} from "../contexts/user";
import {AdminUser} from "../pages/AdminUser";
import {render} from "@testing-library/react";
import {BrowserRouter as Router} from 'react-router-dom';

jest.mock('../api/BasilApi', () => {
    // Require the original module to not be mocked...
    const originalModule = jest.requireActual('../api/BasilApi');
    const user: Partial<User> = {
        id: 30,
        name: "Mario",
        surname: "Rossi",
        email: "mario@rossi.com",
        password: "mariorossi",
    }

    return {
        __esModule: true, // Use it when dealing with esModules
        ...originalModule,
        getUser: () => Promise.resolve(user),
        createUser: (_user: Partial<User>) => Promise.resolve(_user)
    };
});

test('create user', async () => {
    const user: Partial<User> = {
        name: "Mario",
        surname: "Rossi",
        email: "mario@rossi.com",
        password: "mariorossi",
    }
    const wrapper = ({children}) =>
        <Router>
            <PendingStateContext.Provider value={{pending: true, setPending: (value: boolean) => true}}>
                <UserContext.Provider value={{user: false, setUser: (value: false | User) => user}}>
                    {children}
                </UserContext.Provider>
            </PendingStateContext.Provider>
        </Router>

    const {result} = renderHook(() => useUser(), {wrapper})
    await act(async () => expect((await result.current.upsertUser(user)).email).toEqual("mario@rossi.com"))
})
