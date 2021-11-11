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
            <svg
              width="32"
              height="32"
              viewBox="0 0 456 456"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="228" cy="228" r="228" fill="#5DD886" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M28.708 338.84C23.658 272.315 68.3297 45.5122 392.5 143C355.447 140.27 330.321 190.357 307.011 236.824C300.438 249.926 294.01 262.739 287.5 274C267.121 319.424 187.298 423.278 89.2562 408.94C64.6032 390.008 43.9301 366.151 28.708 338.84Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M84.1488 404.901C76.1242 398.368 68.5525 391.299 61.4883 383.75C65.8644 335.83 80.2611 283.425 109.5 248.5C108.39 223.065 109.299 210.285 113 189.5C116.216 204.759 118.885 213.096 127.5 227C143.834 210.833 192.8 178.3 258 177.5C247 180 218.8 188.9 194 204.5C199.401 210.123 204.063 213.219 219.5 218.5C194.982 221.303 185.461 220.673 170.5 218.5C154.81 231.397 124.626 264.209 113 291.5C133.678 295.835 145.731 297.699 170.5 297C142.278 308.958 127.149 313.369 101 318.5C95.8675 331.565 85.509 361.179 84.1488 404.901Z"
                fill="#5DD886"
              />
            </svg>
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
