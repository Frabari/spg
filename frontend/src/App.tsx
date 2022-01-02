import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container, LinearProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './Theme';
import Notifications from './components/Notification';
import { ProtectedRoute } from './components/ProtectedRoute';
import { usePendingState } from './hooks/usePendingState';
import { Admin } from './pages/Admin';
import Checkout from './pages/Checkout';
import { Customer } from './pages/Customer';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Products from './pages/Products';
import SignUp from './pages/SignUp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { showLoadingIndicator } = usePendingState();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Notifications />
        <ThemeProvider theme={themeOptions}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />

              <Route path="/login" element={<Login />} />

              <Route path="/signup" element={<SignUp />} />

              <Route
                path="/checkout"
                element={
                  <Container>
                    <Checkout />
                  </Container>
                }
              />

              <Route
                path="/account/*"
                element={
                  <ProtectedRoute>
                    <Customer />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              <Route path="/products/*" element={<Products />} />
            </Routes>
          </BrowserRouter>
          {showLoadingIndicator && (
            <LinearProgress
              sx={{ position: 'fixed', width: '100%', top: 0, zIndex: 11000 }}
            />
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
