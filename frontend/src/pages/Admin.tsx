import { useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import {
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
import { Users } from './Users';
import { Logo } from '../components/Logo';
import { drawerWidth } from '../constants';
import { Inventory, Person, ShoppingCart } from '@mui/icons-material';

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
          <ListItem key={page.path}>
            <ListItemButton
              component={Link}
              to={`/admin/${page.path}`}
              sx={{ px: 1, borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 0, pr: 2 }}>
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
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
            element={<Users handleDrawerToggle={handleDrawerToggle} />}
          />
          <Route
            path="/products"
            element={<Users handleDrawerToggle={handleDrawerToggle} />}
          />
        </Routes>
      </Box>
    </Box>
  );
};
