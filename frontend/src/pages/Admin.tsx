import { useContext, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
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
} from '@mui/material';
import { Inventory, Person, ShoppingCart } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { AdminUsers } from './AdminUsers';
import { Logo } from '../components/Logo';
import { drawerWidth } from '../constants';
import { AdminUser } from './AdminUser';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminOrder } from './AdminOrder';
import { useUser } from '../hooks/useUser';
import { getMe, logout } from '../api/basil-api';
import { UserContext } from '../contexts/user';
import { PendingStateContext } from '../contexts/pending';
import toast from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

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

export const Admin = (props: { user: any }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { setPending } = useContext(PendingStateContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setPending(true);
      getMe()
        .then(setUser)
        .catch(() => setUser(false))
        .finally(() => setPending(false));
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
          <Avatar src={props.user?.avatar} />
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
          <Route path="/" element={<Navigate to="/admin/users" />} />
          <Route
            path="/users"
            element={<AdminUsers handleDrawerToggle={handleDrawerToggle} />}
          />
          <Route
            path="/users/:id"
            element={<AdminUser handleDrawerToggle={handleDrawerToggle} />}
          />
          <Route
            path="/products"
            element={<AdminProducts handleDrawerToggle={handleDrawerToggle} />}
          />
          <Route
            path="/products/:id"
            element={<AdminProduct handleDrawerToggle={handleDrawerToggle} />}
          />
          <Route
            path="/orders"
            element={<AdminOrders handleDrawerToggle={handleDrawerToggle} />}
          />
          <Route
            path="/orders/:id"
            element={<AdminOrder handleDrawerToggle={handleDrawerToggle} />}
          />
        </Routes>
      </Box>
    </Box>
  );
};
