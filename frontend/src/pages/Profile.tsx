import { MouseEvent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Save } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Container,
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
import { usePendingState } from '../hooks/usePendingState';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';

export default function Profile() {
  const { profile, upsertProfile } = useProfile();
  const { pending, setPending } = usePendingState();
  const [show, setShow] = useState(false);
  const form = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      avatar: '',
      location: null,
    } as Partial<User>,
    onSubmit: (values: Partial<User>, { setErrors }) => {
      // TODO return upsertProfile
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

  return (
    <>
      <NavigationBox.NavBar onProducts={false} setBasketListener={null} />
      <Container sx={{ mt: 10 }}>
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
                    disabled={pending}
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
                    disabled={pending}
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
                    disabled={pending}
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
                    disabled={pending}
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
                    disabled={pending}
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
                        // error={!!form.errors?.location?.address}
                        disabled={pending}
                      >
                        <InputLabel htmlFor="address">Address</InputLabel>
                        <OutlinedInput
                          id="address"
                          type="text"
                          onChange={form.handleChange}
                          value={form.values.location?.address}
                          label="Address"
                          name="address"
                        />
                        <FormHelperText>
                          {/*{form.errors?.location?.address}*/}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        // error={!!form.errors?.location?.zipCode}
                        disabled={pending}
                      >
                        <InputLabel htmlFor="address">Zip Code</InputLabel>
                        <OutlinedInput
                          id="zipCode"
                          type="number"
                          onChange={form.handleChange}
                          value={form.values.location?.zipCode}
                          label="Zip Code"
                          name="zipCode"
                        />
                        <FormHelperText>
                          {/*{form.errors?.location?.zipCode}*/}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        // error={!!form.errors?.location?.city}
                        disabled={pending}
                      >
                        <InputLabel htmlFor="address">City</InputLabel>
                        <OutlinedInput
                          id="city"
                          type="text"
                          onChange={form.handleChange}
                          value={form.values.location?.city}
                          label="City"
                          name="city"
                        />
                        <FormHelperText>
                          {/*{form.errors?.location?.city}*/}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        // error={!!form.errors?.location?.province}
                        disabled={pending}
                      >
                        <InputLabel htmlFor="address">Province</InputLabel>
                        <OutlinedInput
                          id="province"
                          type="text"
                          onChange={form.handleChange}
                          value={form.values.location?.province}
                          label="Province"
                          name="province"
                        />
                        <FormHelperText>
                          {/*{form.errors?.location?.province}*/}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl
                        variant="outlined"
                        fullWidth
                        // error={!!form.errors?.location?.region}
                        disabled={pending}
                      >
                        <InputLabel htmlFor="address">Region</InputLabel>
                        <OutlinedInput
                          id="region"
                          type="text"
                          onChange={form.handleChange}
                          value={form.values.location?.region}
                          label="Region"
                          name="region"
                        />
                        <FormHelperText>
                          {/*{form.errors?.location?.region}*/}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid container direction="row">
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        sx={{ m: 0 }}
                        variant="contained"
                        disabled={true}
                        onClick={form.submitForm}
                        startIcon={<Save />}
                      >
                        <Typography sx={{ textTransform: 'none' }}>
                          Save changes
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
