import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useSearchParams,
} from 'react-router-dom';
import { Inventory, Person, ShoppingCart } from '@mui/icons-material';
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
import { logout, Role, User } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { Logo } from '../components/Logo';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { drawerWidth } from '../constants';
import { usePendingState } from '../hooks/usePendingState';
import { useProfile } from '../hooks/useProfile';
import { AdminOrder } from './AdminOrder';
import { AdminOrders } from './AdminOrders';
import { AdminProduct } from './AdminProduct';
import { AdminProducts } from './AdminProducts';
import { AdminUser } from './AdminUser';
import { AdminUsers } from './AdminUsers';

const pages = [
  {
    title: 'Users',
    path: 'users',
    icon: <Person />,
  },
  {
    title: 'Products',
    path: 'products',
    icon: <Inventory />,
  },
  {
    title: 'Orders',
    path: 'orders',
    icon: <ShoppingCart />,
  },
];

export const Admin = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, load } = useProfile();
  const { pending, setPending } = usePendingState();
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
      setPending(true);
      load();
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
              to={`/admin/${page.path}`}
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

  if (typeof profile === 'object' && profile.role === Role.CUSTOMER) {
    return <Navigate to="/products" />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Admin pages"
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
                <Navigate to="/admin/users" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminUsers
                  handleDrawerToggle={handleDrawerToggle}
                  role={queryParams.get('role')}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <AdminUser handleDrawerToggle={handleDrawerToggle} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AdminProducts
                  handleDrawerToggle={handleDrawerToggle}
                  profile={typeof profile === 'object' ? profile : null}
                  category={queryParams.get('category')}
                  farmers={queryParams.get('farmer')}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <AdminProduct handleDrawerToggle={handleDrawerToggle} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AdminOrders
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
                <AdminOrder handleDrawerToggle={handleDrawerToggle} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};
