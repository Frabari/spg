import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import { PendingStateContext } from './contexts/pending';
import { UserContext } from './contexts/user';
import Homepage from './pages/Homepage';
import { themeOptions } from './Theme';
import Login from './pages/Login';
import { Admin } from './pages/Admin';
import Products from './pages/Products';
import { getMe } from './api/basil-api';

function App() {
  const [pending, setPending] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setPending(true);
    getMe()
      .then(setUser)
      .catch(() => setUser(false))
      .finally(() => setPending(false));
  }, []);

  return (
    <PendingStateContext.Provider value={{ pending, setPending }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Toaster />
        <ThemeProvider theme={themeOptions}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />

              <Route path="/home" element={<Homepage />} />

              <Route path="/login" element={<Login />} />

              <Route path="/admin/*" element={<Admin user={user} />} />

              <Route path="/products" element={<Products />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserContext.Provider>
    </PendingStateContext.Provider>
  );
}

export default App;
