import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Person, ShoppingCart } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Autocomplete,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { logout, Role } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import Basket from '../components/Basket';
import { Logo } from '../components/Logo';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { useUsers } from '../hooks/useUsers';
import { usePendingState } from '../hooks/usePendingState';
import { useProfile } from '../hooks/useProfile';

interface LinkTabProps {
  label: string;
  slug?: string;
  handleFilter?: any;
}

function LinkTab({ slug, label, ...rest }: LinkTabProps) {
  return (
    <Tab
      component={Link}
      to={`/products${slug ? `?category=${slug}` : ''}`}
      label={label}
      {...rest}
    />
  );
}

function NavTabs(props: any) {
  const [value, setValue] = React.useState(0);
  const [queryParams] = useSearchParams();
  const { categories } = useCategories();

  useEffect(() => {
    const categoryIndex = categories.findIndex(
      c => c.slug === queryParams.get('category'),
    );
    setValue(categoryIndex !== -1 ? categoryIndex + 1 : 0);
  }, [queryParams, categories]);

  return (
    <Toolbar
      sx={{ width: '100%', minHeight: '0!important', px: '0!important' }}
    >
      <Tabs value={value} variant="scrollable" scrollButtons="auto">
        <LinkTab key="all" label="all" />
        {categories?.map(c => (
          <LinkTab key={c.id} label={c.name} slug={c.slug} />
        ))}
      </Tabs>
    </Toolbar>
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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  color: 'inherit',
  '& .MuiAutocomplete-inputRoot': {
    padding: theme.spacing(0, 0, 0, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '25ch',
    },
  },
}));

function NavBar(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [list, setList] = useState([]);
  const { profile } = useProfile();
  const { setPending } = usePendingState();
  const [showBasket, setShowBasket] = React.useState(false);
  const navigate = useNavigate();
  const { products } = useProducts();
  const { users } = useUsers();

  useEffect(() => {
    setList([...products, ...users.filter(u => u.role === Role.FARMER)]);
  }, [products, users]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setPending(true);
    } catch (e) {
      toast.error((e as ApiException).message);
    }
  };
  return profile === null ? null : profile === false ? (
    <Navigate to="/login" />
  ) : (
    <>
      <AppBar position="fixed" sx={{ borderBottom: '1px solid #f3f4f6' }}>
        <Container>
          <Toolbar sx={{ px: '0!important' }}>
            <IconButton href={'/'}>
              <Logo />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ ml: 1, mr: 'auto' }}>
              Basil
            </Typography>
            {props.loggedIn === 0 ? (
              <Box sx={{ position: 'absolute', right: 0 }}>
                <Button
                  component={Link}
                  to={'/login'}
                  sx={{ px: 3, marginRight: '16px' }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to={'/signup'}
                  variant="contained"
                  sx={{ px: 3 }}
                >
                  Sign Up
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <StyledAutocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={list.map(option => (
                      <Box
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <img
                          loading="lazy"
                          width="20"
                          src={
                            option?.role !== null
                              ? option?.avatar
                              : option?.image
                          }
                          alt=""
                        />
                        {option?.role !== null
                          ? option?.name + '' + option?.surname
                          : option?.name}
                      </Box>
                    ))}
                    autoHighlight
                    renderInput={params => (
                      <TextField
                        sx={{ padding: 0 }}
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          type: 'search',
                          startAdornment: (
                            <InputAdornment
                              position="start"
                              sx={{ marginLeft: 1 }}
                            >
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ display: { md: 'flex' }, ml: 'auto' }}>
                  <IconButton size="large" onClick={handleMenu}>
                    <Avatar src={profile?.avatar} />
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
                    {profile.role !== Role.CUSTOMER && (
                      <MenuItem onClick={() => navigate('/admin')}>
                        <Person /> Admin
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon /> Logout
                    </MenuItem>
                  </Menu>
                  <IconButton size="large" aria-label="show cart">
                    <Badge badgeContent={4}>
                      <ShoppingCart onClick={() => setShowBasket(true)} />
                    </Badge>
                  </IconButton>
                </Box>
              </>
            )}
          </Toolbar>
          {props.products && <NavTabs {...props} />}
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={showBasket}
        onClose={() => setShowBasket(false)}
      >
        <Box sx={{ width: { xs: '100%', sm: '40vw' } }}>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ p: 3, fontWeight: 'bold' }}
          >
            Basket
          </Typography>
          <Basket />
        </Box>
      </Drawer>
    </>
  );
}

const NavigationBox = { NavTabs, NavBar };
export default NavigationBox;
