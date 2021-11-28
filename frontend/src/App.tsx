import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './Theme';
import { ProtectedRoute } from './components/ProtectedRoute';
import { usePendingState } from './hooks/usePendingState';
import { Admin } from './pages/Admin';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Products from './pages/Products';
import SignUp from './pages/SignUp';

function App() {
  const { showLoadingIndicator } = usePendingState();
  return (
    <>
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
              path="/products/*"
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
    </>
  );
}

export default App;
