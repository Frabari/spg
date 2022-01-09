import { MouseEvent, useEffect, useState } from 'react';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Save } from '@mui/icons-material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { User } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { usePendingState } from '../hooks/usePendingState';
import { useUpsertTransaction } from '../hooks/useUpsertTransaction';
import { useUpsertUser } from '../hooks/useUpsertUser';
import { useUser } from '../hooks/useUser';
import { Balance } from './Balance';

export const AdminUser = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { data: user } = useUser(id);
  const { upsertUser } = useUpsertUser();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const { upsertTransaction } = useUpsertTransaction();
  const { pending } = usePendingState();
  const form = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      avatar: '',
      address: null,
    } as Partial<User>,
    onSubmit: (values: Partial<User>, { setErrors }) => {
      if (!values.password?.length) {
        delete values.password;
      }
      return upsertUser(values)
        .then(newUser => {
          const creating = id == null;
          toast.success(`User ${creating ? 'created' : 'updated'}`);
          if (creating) {
            navigate(`/admin/users/${(newUser as User).id}`);
          } else {
            navigate('/admin/users');
          }
        })
        .catch(e => {
          setErrors(e.data?.constraints);
        });
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues(user);
      form.values.password = '';
    }
  }, [user]);

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const change = (add: boolean, amount: number) => {
    if (amount > 0) {
      amount = add ? amount : -amount;
      upsertTransaction({
        user: { id: user.id } as User,
        amount,
      })
        .then(() => {
          toast.success(`Wallet updated`);
          navigate(`/admin/users/${user?.id}`);
          setOpen(false);
        })
        .catch(() => {
          //noop
        });
    } else {
      toast.error(`Amount should be a positive and not null number`);
    }
  };

  return (
    <>
      <AdminAppBar handleDrawerToggle={props.handleDrawerToggle}>
        <IconButton onClick={() => navigate('/admin/users')}>
          <ArrowBackIcon />
        </IconButton>
        <Balance open={open} setOpen={setOpen} user={user} change={change} />
        <Typography
          variant="h6"
          noWrap
          component="h1"
          color="primary.main"
          fontWeight="bold"
          sx={{ fontSize: { sm: 28 }, mr: 'auto' }}
        >
          Users / {user ? `${user.name} ${user.surname}` : 'New'}
        </Typography>
        <IconButton
          type="submit"
          sx={{ display: { xs: 'flex', md: 'none' } }}
          className="save-icon-button"
          onClick={form.submitForm}
          disabled={!!pending}
        >
          <Save />
        </IconButton>
        <Button
          type="submit"
          sx={{
            display: { xs: 'none', md: 'flex' },
          }}
          variant="contained"
          onClick={form.submitForm}
          disabled={!!pending}
          startIcon={<Save />}
        >
          <Typography display="inline" sx={{ textTransform: 'none' }}>
            Save Changes
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 2, sm: 3 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <Paper
          className="AdminUser"
          sx={{ p: { xs: 2, sm: 3 }, py: { sm: 4 }, position: 'relative' }}
        >
          <div className="container relative">
            <Avatar
              src={(user as User)?.avatar}
              alt="profile avatar"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '40px',
              }}
            />
            <Grid
              container
              direction="row"
              columnSpacing={4}
              rowSpacing={2}
              gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
            >
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.name}
                  disabled={!!pending}
                >
                  <InputLabel htmlFor="name">Name</InputLabel>
                  <OutlinedInput
                    id="name"
                    type="text"
                    onChange={form.handleChange}
                    value={form.values.name}
                    label="Name"
                    name="name"
                  />
                  <FormHelperText>{form.errors?.name}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.surname}
                  disabled={!!pending}
                >
                  <InputLabel htmlFor="surname">Surname</InputLabel>
                  <OutlinedInput
                    id="surname"
                    type="text"
                    onChange={form.handleChange}
                    value={form.values.surname}
                    label="Surname"
                    name="surname"
                  />
                  <FormHelperText>{form.errors?.surname}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.email}
                  disabled={!!pending}
                >
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="email"
                    onChange={form.handleChange}
                    value={form.values.email}
                    label="Email"
                    name="email"
                  />
                  <FormHelperText>{form.errors?.email}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.password}
                  disabled={!!pending}
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={show ? 'text' : 'password'}
                    onChange={form.handleChange}
                    value={form.values.password ?? ''}
                    label="Password"
                    name="password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{form.errors?.password}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.avatar}
                  disabled={!!pending}
                >
                  <InputLabel htmlFor="avatar">Avatar</InputLabel>
                  <OutlinedInput
                    id="avatar"
                    type="text"
                    onChange={form.handleChange}
                    value={form.values.avatar}
                    label="Avatar"
                    name="avatar"
                  />
                  <FormHelperText>{form.errors?.avatar}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.balance}
                  disabled={!!pending}
                >
                  <InputLabel htmlFor="balance">Balance</InputLabel>
                  <OutlinedInput
                    disabled
                    label="Balance"
                    value={(user as User)?.balance ?? ''}
                    readOnly={true}
                    startAdornment={
                      <InputAdornment position="start"> € </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="manage profile wallet"
                          color="success"
                          edge="end"
                          onClick={() => setOpen(true)}
                        >
                          <AccountBalanceWalletIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <FormHelperText>{form.errors?.balance}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  direction="row"
                  columnSpacing={4}
                  rowSpacing={2}
                  gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
                >
                  <Grid item xs={12}>
                    <Typography
                      mt="24px"
                      variant="h5"
                      color="primary.main"
                      sx={{ mb: 2, fontWeight: 'bold' }}
                    >
                      Delivery information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!form.errors?.address?.address}
                      disabled={!!pending}
                    >
                      <InputLabel htmlFor="address">Address</InputLabel>
                      <OutlinedInput
                        id="address"
                        type="text"
                        onChange={form.handleChange}
                        value={form.values.address?.address ?? ''}
                        label="Address"
                        name="address.address"
                      />
                      <FormHelperText>
                        {form.errors?.address?.address}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!form.errors?.address?.zipCode}
                      disabled={!!pending}
                    >
                      <InputLabel htmlFor="address">Zip Code</InputLabel>
                      <OutlinedInput
                        id="zipCode"
                        type="text"
                        onChange={form.handleChange}
                        value={form.values.address?.zipCode ?? ''}
                        label="Zip Code"
                        name="address.zipCode"
                      />
                      <FormHelperText>
                        {form.errors?.address?.zipCode}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!form.errors?.address?.city}
                      disabled={!!pending}
                    >
                      <InputLabel htmlFor="address">City</InputLabel>
                      <OutlinedInput
                        id="city"
                        type="text"
                        onChange={form.handleChange}
                        value={form.values.address?.city ?? ''}
                        label="City"
                        name="address.city"
                      />
                      <FormHelperText>
                        {form.errors?.address?.city}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!form.errors?.address?.province}
                      disabled={!!pending}
                    >
                      <InputLabel htmlFor="address">Province</InputLabel>
                      <OutlinedInput
                        id="province"
                        type="text"
                        onChange={form.handleChange}
                        value={form.values.address?.province ?? ''}
                        label="Province"
                        name="address.province"
                      />
                      <FormHelperText>
                        {form.errors?.address?.province}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!form.errors?.address?.region}
                      disabled={!!pending}
                    >
                      <InputLabel htmlFor="address">Region</InputLabel>
                      <OutlinedInput
                        id="region"
                        type="text"
                        onChange={form.handleChange}
                        value={form.values.address?.region ?? ''}
                        label="Region"
                        name="address.region"
                      />
                      <FormHelperText>
                        {form.errors?.address?.region}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Box>
    </>
  );
};
