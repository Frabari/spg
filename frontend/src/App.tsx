import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import UsersPage from './pages/Users';
import Homepage from './pages/Homepage';
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './pages/CustomTheme';
import UsersInfo from './pages/UsersInfo';
import Login from './pages/Login';
import ProductInfo from './pages/ProductInfo';

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <div className="App" style={{ backgroundColor: '#fafafa' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />

            <Route path="/home" element={<Homepage />} />

            <Route path="/login" element={<Login />} />

            <Route path="/users" element={<UsersPage />} />

            <Route path="/UsersInfo/" element={<UsersInfo />} />

            <Route path="/productsInfo/" element={<ProductInfo />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
