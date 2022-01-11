import { MouseEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { User } from '../api/BasilApi';
import { Logo } from '../components/Logo';
import { useLogin } from '../hooks/useLogin';
import { usePendingState } from '../hooks/usePendingState';
import { useProfile } from '../hooks/useProfile';

const OutlinedCard = () => {
  const [show, setShow] = useState(false);
  const { pending } = usePendingState();
  const { mutateAsync: login } = useLogin();
  const form = useFormik({
    initialValues: {
      email: null,
      password: null,
    } as Partial<User>,
    onSubmit: (values: Partial<User>) =>
      login({ username: values.email, password: values.password }).catch(() => {
        toast.error('Cannot login, please check your credentials');
      }),
  });

  const handleClickShowPassword = () => {
    setShow(!show);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Card variant="outlined" sx={{ mx: 1 }}>
      <CardContent
        sx={{
          pb: 0,
          p: 4,
          px: { xs: 2, sm: 4 },
          maxWidth: 300,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={form.handleSubmit}
        >
          <div>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Login
            </Typography>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <FormControl
                  sx={{ width: 250 }}
                  error={!!form.errors?.email}
                  disabled={!!pending}
                  required
                >
                  <InputLabel htmlFor="outlined-adornment-email">
                    Email
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email"
                    onChange={form.handleChange}
                    label="Email"
                    name="email"
                    type="email"
                    value={form.values.email}
                  />
                  <FormHelperText>{form.errors?.email}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!form.errors?.password}
                  disabled={!!pending}
                  required
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={show ? 'text' : 'password'}
                    value={form.values.password}
                    name="password"
                    onChange={form.handleChange}
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
                    label="Password"
                  />
                  <FormHelperText>{form.errors?.password}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </div>
          <input type="submit" style={{ display: 'none' }} />
        </Box>
      </CardContent>
      <CardActions>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyItems="center"
          paddingBottom="1rem"
        >
          <Grid item sx={{ p: 2, pt: 0 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={!!pending}
              onClick={form.submitForm}
              sx={{ px: 3 }}
            >
              Login
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body2" display="inline">
              {'Not registered? '}
            </Typography>
            <Typography
              variant="body2"
              color="primary.main"
              component={Link}
              to="/signup"
              display="inline"
              sx={{ textDecoration: 'none' }}
            >
              {'Sign up!'}
            </Typography>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export const Login = () => {
  const { data: profile } = useProfile();

  if (profile) {
    return <Navigate to="/products" />;
  }
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}
    >
      <Grid item xs={4}>
        <Box sx={{ flexGrow: 1 }} style={{ width: 'fit-content' }}>
          <Grid
            container
            spacing={1}
            direction="row"
            justifyContent="center"
            marginBottom="2rem"
          >
            <Grid item>
              <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
                <Grid container direction="row">
                  <Grid item>
                    <Logo />
                  </Grid>
                  <Grid item>
                    <Typography
                      display="inline"
                      variant="h6"
                      component="div"
                      marginLeft="10px"
                    >
                      Basil
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <OutlinedCard />
        </Box>
      </Grid>
    </Grid>
  );
};
