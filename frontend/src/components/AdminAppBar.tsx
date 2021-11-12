import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { drawerWidth } from '../constants';
import { PropsWithChildren } from 'react';

export const AdminAppBar = (
  props: PropsWithChildren<{ handleDrawerToggle: () => void }>,
) => (
  <AppBar
    position="static"
    sx={{
      // width: { sm: `calc(100% - ${drawerWidth}px)` },
      // ml: { sm: `${drawerWidth}px` },
      pt: { sm: '20px' },
      background: { sm: 'none' },
      boxShadow: { sm: 'none' },
    }}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={props.handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      {props.children}
    </Toolbar>
  </AppBar>
);
