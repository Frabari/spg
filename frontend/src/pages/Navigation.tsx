import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Button,
  InputBase,
  Menu,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Person from '@mui/icons-material/Person';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import { Logo } from '../components/Logo';

interface LinkTabProps {
  label?: string;
  href?: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

function NavTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange}>
        <LinkTab label="Fruits" href="/fruits" />
        <LinkTab label="Vegetables" href="/vegetables" />
      </Tabs>
    </Box>
  );
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f7f7f7',
  '&:hover': {
    backgroundColor: '#f7f7f7',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function NavBar(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton href={'/home'}>
            <Logo />
          </IconButton>
          <Typography variant="h6" component="div" marginLeft="10px">
            Basil
          </Typography>
          {props.loggedIn === 0 ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Button component={Link} to={'/login'}>
                Login
              </Button>
            </>
          ) : (
            <>
              <Box marginX="auto">
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon style={{ color: '#737373' }} />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </Box>

              <Box sx={{ display: { md: 'flex' } }}>
                <IconButton size="large" onClick={handleMenu}>
                  <Person />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My orders</MenuItem>
                  <MenuItem component={Link} to={'/home'}>
                    <LogoutIcon /> Logout
                  </MenuItem>
                </Menu>
                <IconButton size="large" aria-label="show cart">
                  <Badge badgeContent={4}>
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

const NavigationBox = { NavTabs, NavBar };
export default NavigationBox;
