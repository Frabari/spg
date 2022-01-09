import { MouseEvent, useEffect, useState } from 'react';
import React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Save, Info } from '@mui/icons-material';
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
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { User } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { usePendingState } from '../hooks/usePendingState';
import { useProfile } from '../hooks/useProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

export default function Profile(props: { handleDrawerToggle: () => void }) {
  const { data: profile } = useProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { pending } = usePendingState();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const form = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      avatar: '',
      address: null,
    } as Partial<User>,
    onSubmit: (values: Partial<User>, { setErrors, setSubmitting }) => {
      if (!values.password?.length) {
        delete values.password;
      }
      setSubmitting(true);
      updateProfile(values, {
        onSuccess() {
          toast.success('Profile updated!');
          navigate('/products');
        },
        onError(error: any) {
          setErrors(error.data?.constraints);
        },
        onSettled() {
          setSubmitting(false);
        },
      });
    },
  });

  useEffect(() => {
    if (profile) {
      form.setValues(profile);
    }
  }, [profile]);

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <AdminAppBar handleDrawerToggle={props.handleDrawerToggle}>
        <Typography
          variant="h6"
          noWrap
          component="h1"
          color="primary.main"
          fontWeight="bold"
          sx={{ fontSize: { sm: 28 }, mr: 'auto' }}
        >
          {(profile as User).name} {(profile as User).surname}
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
              src={(profile as User)?.avatar}
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
                    value={form.values.password}
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
                  error={!!form.errors?.avatar}
                  disabled={!!pending}
                >
                  <TextField
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                        >
                          <Info sx={{ fontSize: 27 }}></Info>
                          <Popover
                            id="mouse-over-popover"
                            sx={{
                              pointerEvents: 'none',
                            }}
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'left',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'left',
                            }}
                            onClose={handlePopoverClose}
                            disableRestoreFocus
                          >
                            <Typography sx={{ p: 1 }}>
                              Use it on telegram
                            </Typography>
                          </Popover>
                        </IconButton>
                      ),
                    }}
                    id="telegram-token"
                    type="text"
                    value={form.values.id}
                    label="Telegram token"
                    name="Telegram token"
                  ></TextField>
                  <FormHelperText>{form.errors?.avatar}</FormHelperText>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      error={!!form.errors?.phoneNumber}
                      disabled={!!pending}
                    >
                      <InputLabel htmlFor="phonenumber">PhoneNumber</InputLabel>
                      <OutlinedInput
                        id="phonenumber"
                        type="text"
                        onChange={form.handleChange}
                        value={form.values.phoneNumber ?? ''}
                        label="PhoneNumber"
                        name="phoneNumber"
                      />
                      <FormHelperText>
                        {form.errors?.phoneNumber}
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
}
