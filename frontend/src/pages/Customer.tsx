import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { Person, ShoppingCart } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { User } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { Logo } from '../components/Logo';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { drawerWidth } from '../constants';
import { useLogout } from '../hooks/useLogout';
import { useProfile } from '../hooks/useProfile';
import { CustomerOrder } from './CustomerOrder';
import { CustomerOrders } from './CustomerOrders';
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
  const { data: profile } = useProfile();
  const { mutateAsync: logout } = useLogout();
  const [queryParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width:760px)');
  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      toast.error((e as ApiException).message);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <IconButton href="/" sx={{ p: 0 }}>
          <Logo />
        </IconButton>
        <Typography variant="h6" component="h1" marginLeft="10px">
          Basil
        </Typography>
      </Toolbar>
      <Divider />
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
      <List sx={{ position: 'absolute', bottom: 0 }}>
        <ListItem>
          <Avatar src={(profile as User)?.avatar} />
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Customer pages"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
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
