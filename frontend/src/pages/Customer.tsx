import { useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { Person, ShoppingCart } from '@mui/icons-material';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { drawerWidth } from '../constants';
import { CustomerOrder } from './CustomerOrder';
import { CustomerOrders } from './CustomerOrders';
import NavigationBox from './Navigation';
import Profile from './Profile';

const pages = [
  {
    title: 'Profile',
    path: 'profile',
    icon: <Person />,
  },
  {
    title: 'Orders',
    path: 'orders',
    icon: <ShoppingCart />,
  },
];

export const Customer = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [queryParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width:760px)');
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <List>
        {pages.map(page => (
          <ListItem key={page.path} sx={{ py: 0, px: 1 }}>
            <ListItemButton
              component={Link}
              to={`/account/${page.path}`}
              sx={{ borderRadius: 2 }}
              onClick={handleDrawerToggle}
            >
              <ListItemIcon sx={{ minWidth: 0, pr: 2 }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List sx={{ position: 'absolute', bottom: 0 }}></List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <NavigationBox.NavBar />
      <Box
        sx={{
          marginTop: 15,
        }}
      >
        {drawer}
      </Box>
      <Box
        component="main"
        sx={{
          marginTop: 8,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minWidth: 0,
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/account/profile" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile handleDrawerToggle={handleDrawerToggle} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <CustomerOrders
                  handleDrawerToggle={handleDrawerToggle}
                  status={queryParams.get('status')}
                  week={queryParams.get('week')}
                  delivery={queryParams.get('delivery')}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <CustomerOrder handleDrawerToggle={handleDrawerToggle} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};
