import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import { PendingStateContext } from './contexts/pending';
import UsersPage from './pages/Users';
import Homepage from './pages/Homepage';
import { themeOptions } from './pages/CustomTheme';
import UsersInfo from './pages/UsersInfo';
import Login from './pages/Login';

function App() {
  const [pending, setPending] = useState(false);
  return (
    <PendingStateContext.Provider value={{ pending, setPending }}>
      <ThemeProvider theme={themeOptions}>
        <div className="App" style={{ backgroundColor: '#fafafa' }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />

              <Route path="/home" element={<Homepage />} />

              <Route path="/login" element={<Login />} />

              <Route path="/users" element={<UsersPage />} />

              <Route path="/UsersInfo/" element={<UsersInfo />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </PendingStateContext.Provider>
  );
}

export default App;
