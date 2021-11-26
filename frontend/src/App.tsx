import { useEffect, useRef, useState } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './Theme';
import { getMe, User } from './api/BasilApi';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PendingStateContext } from './contexts/pending';
import { Admin } from './pages/Admin';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Products from './pages/Products';
import SignUp from './pages/SignUp';

const globalUser: User | null | false = null;

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState({
  user: globalUser,
});

function App() {
  const [pending, setPending] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const timerRef = useRef<number>();

  useEffect(() => {
    setPending(true);
    getMe()
      .then(user => setGlobalState('user', user))
      .catch(() => setGlobalState('user', false))
      .finally(() => {
        setPending(false);
      });
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
    <PendingStateContext.Provider value={{ pending, setPending }}>
      <Toaster />
      <ThemeProvider theme={themeOptions}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        {showLoadingIndicator && (
          <LinearProgress
            sx={{ position: 'fixed', width: '100%', top: 0, zIndex: 11000 }}
          />
        )}
      </ThemeProvider>
    </PendingStateContext.Provider>
  );
}

export { useGlobalState, setGlobalState, getGlobalState, App };
