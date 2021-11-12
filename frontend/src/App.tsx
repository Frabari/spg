import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './pages/CustomTheme';
import UsersInfo from './pages/UsersInfo';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <div className="App" style={{ backgroundColor: '#fafafa' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/home" element={<Homepage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={<Admin />} />

            <Route path="/UsersInfo/" element={<UsersInfo />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
