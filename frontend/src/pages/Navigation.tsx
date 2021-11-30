import * as React from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Person, ShoppingCart } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  Grid,
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
import { useBasket } from '../hooks/useBasket';
import { useCategories } from '../hooks/useCategories';
import { usePendingState } from '../hooks/usePendingState';
import { useProducts } from '../hooks/useProducts';
import { useProfile } from '../hooks/useProfile';
import { useUsers } from '../hooks/useUsers';

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
  '& .MuiFormControl-root': {
    border: 'none !important',
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
  },
  '& .MuiAutocomplete-inputRoot': {
    padding: theme.spacing(0, 0, 0, 0),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '35ch',
    },
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
}));

function NavBar(props: any) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [list, setList] = useState([]);
  const { profile, load } = useProfile();
  const { setPending } = usePendingState();
  const [showBasket, setShowBasket] = React.useState(false);
  const navigate = useNavigate();
  const { products } = useProducts();
  const { users } = useUsers();
  const { basket } = useBasket();

  useEffect(() => {
    const u = users
      .filter(u => u.role === Role.FARMER)
      .map(user => ({
        ...user,
        type: 'Farmers',
      }));
    const p = products
      .filter(product => product.available > 0)
      .map(product => ({
        ...product,
        type: 'Products',
      }));
    setList([...p, ...u]);
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
      load();
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
                <Box>
                  <StyledAutocomplete
                    id="free-solo-2-demo"
                    disableClearable
                    freeSolo
                    options={
                      props.farmer
                        ? list.filter(
                            option =>
                              option.farmer?.email === props.farmer?.email,
                          )
                        : list
                    }
                    groupBy={(option: any) => option?.type}
                    getOptionLabel={(option: any) =>
                      option?.type === 'Farmers'
                        ? option?.name + ' ' + option?.surname
                        : option?.name
                    }
                    onChange={(event, value: any) => {
                      if (value.type === 'Farmers') {
                        props.setFarmer(value);
                      } else {
                        props.handleSearch(value.name);
                      }
                    }}
                    renderOption={(props, option: any) => (
                      <Box
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <Avatar
                          sx={{ margin: 1 }}
                          src={
                            option?.type === 'Farmers'
                              ? option?.avatar
                              : option?.image
                          }
                        />
                        {option?.type === 'Farmers'
                          ? option?.name + ' ' + option?.surname
                          : option?.name}
                      </Box>
                    )}
                    autoHighlight
                    renderInput={params => (
                      <TextField
                        onChange={e => props.handleSearch(e.target.value)}
                        placeholder="Search..."
                        sx={{ padding: 0 }}
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          autoComplete: 'new-password',
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
                        <Person sx={{ mr: 2 }} /> Admin
                      </MenuItem>
                    )}
                    <MenuItem>
                      <AccountBalanceWalletIcon sx={{ mr: 2 }} />{' '}
                      {profile.balance} €
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 2 }} /> Logout
                    </MenuItem>
                  </Menu>
                  <IconButton
                    size="large"
                    aria-label="show cart"
                    onClick={() => setShowBasket(true)}
                  >
                    <Badge badgeContent={basket?.entries?.length}>
                      <ShoppingCart />
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
        sx={{ width: '300px' }}
        anchor="right"
        open={showBasket}
        onClose={() => {
          setShowBasket(false);
          props.setBasketListener(true);
        }}
      >
        <Box>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={1}>
              <IconButton
                sx={{ margin: 1.5 }}
                onClick={() => {
                  setShowBasket(false);
                  props.setBasketListener(true);
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              <Typography
                variant="h5"
                color="primary.main"
                fontWeight="bold"
                m={2}
              >
                Basket
              </Typography>
            </Grid>
          </Grid>
          <Basket balanceWarning={props.balanceWarning} />
        </Box>
      </Drawer>
    </>
  );
}

const NavigationBox = { NavTabs, NavBar };
export default NavigationBox;
