import { PropsWithChildren } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';

export const AdminAppBar = (
  props: PropsWithChildren<{ handleDrawerToggle: () => void }>,
) => (
  <AppBar
    position="static"
    sx={{
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
