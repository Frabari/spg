import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {useEffect, useRef, useState} from 'react';
import {Toaster} from 'react-hot-toast';
import {ThemeProvider} from '@mui/material/styles';
import {LinearProgress} from '@mui/material';
import {PendingStateContext} from './contexts/pending';
import {UserContext} from './contexts/user';
import Homepage from './pages/Homepage';
import {themeOptions} from './Theme';
import Login from './pages/Login';
import {Admin} from './pages/Admin';
import Products from './pages/Products';
import {getMe} from './api/basil-api';
import SignUp from './pages/SignUp';

function App() {
    const [pending, setPending] = useState(false);
    const [user, setUser] = useState(null);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const timerRef = useRef<number>();

    useEffect(() => {
        setPending(true);
        getMe()
            .then(setUser)
            .catch(() => setUser(false))
            .finally(() => setPending(false));
    }, []);

    useEffect(() => {
        if (!pending) {
            timerRef.current = window.setTimeout(() => {
                setShowLoadingIndicator(false);
            }, 1000);
        } else {
            clearTimeout(timerRef.current);
            setShowLoadingIndicator(true);
        }
    }, [pending]);

    return (
        <PendingStateContext.Provider value={{pending, setPending}}>
            <UserContext.Provider value={{user, setUser}}>
                <Toaster/>
                <ThemeProvider theme={themeOptions}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Homepage/>}/>

                            <Route path="/login" element={<Login/>}/>

                            <Route path="/signup" element={<SignUp/>}/>

                            <Route path="/admin/*" element={<Admin user={user}/>}/>

                            <Route path="/products" element={<Products user={user}/>}/>
                        </Routes>
                    </BrowserRouter>
                    {showLoadingIndicator && (
                        <LinearProgress
                            sx={{position: 'fixed', width: '100%', top: 0, zIndex: 11000}}
                        />
                    )}
                </ThemeProvider>
            </UserContext.Provider>
        </PendingStateContext.Provider>
    );
}

export default App;
