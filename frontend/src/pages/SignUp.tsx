import { MouseEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { User } from '../api/BasilApi';
import { Logo } from '../components/Logo';
import { usePendingState } from '../hooks/usePendingState';
import { useProfile } from '../hooks/useProfile';
import { useUser } from '../hooks/useUser';

function OutlinedCard() {
  const [passwordCheck, setPasswordCheck] = useState('');
  const { pending, setPending } = usePendingState();
  const { upsertUser } = useUser(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const form = useFormik({
    initialValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
    } as Partial<User>,
    onSubmit: (values: Partial<User>, { setErrors }) => {
      upsertUser(values)
        .then(u => {
          setPending(true);
          toast.success(`Welcome ${values.name}!`);
          navigate('/login');
        })
        .catch(e => {
          setErrors(e.data?.constraints);
        });
    },
  });

  const handlePasswordCheck = (value: string) => {
    setPasswordCheck(value);
  };

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
        <Box component="form" noValidate autoComplete="off">
          <div>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{ mb: 2, fontWeight: 'bold' }}
            >
              Signup
            </Typography>
            <Grid container rowSpacing={2} direction="column">
              <Grid item>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.name}
                  disabled={pending}
                >
                  <InputLabel htmlFor="outlined-adornment-name">
                    Name
                  </InputLabel>
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
              <Grid item>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.surname}
                  disabled={pending}
                >
                  <InputLabel htmlFor="outlined-adornment-surname">
                    Surname
                  </InputLabel>
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
              <Grid item>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.email}
                  disabled={pending}
                >
                  <InputLabel htmlFor="outlined-adornment-email">
                    Email
                  </InputLabel>
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
              <Grid item>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.password}
                  disabled={pending}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="password"
                    type={show ? 'text' : 'password'}
                    value={form.values?.password ?? ''}
                    onChange={form.handleChange}
                    label="Password"
                    name="password"
                  />
                  <FormHelperText>{form.errors?.password}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-password-repeat">
                    Repeat Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password-repeat"
                    type={show ? 'text' : 'password'}
                    value={passwordCheck ?? ''}
                    onChange={e => handlePasswordCheck(e.target.value)}
                    label="Repeat Password"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <Typography
                  gutterBottom={true}
                  variant="body2"
                  color="primary.main"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  display="inline"
                  sx={{ textDecoration: 'none', cursor: 'pointer' }}
                >
                  {show ? 'Hide password' : 'Show password'}
                </Typography>
              </Grid>
              <Grid item>
                <Collapse in={form.values?.password?.length < 8}>
                  <Alert severity="error">
                    Password must be of at least 8 characters
                  </Alert>
                </Collapse>
                <Collapse
                  in={
                    form.values?.password?.length >= 8 &&
                    form.values?.password !== passwordCheck
                  }
                >
                  <Alert severity="error">Passwords are not matching</Alert>
                </Collapse>
              </Grid>
            </Grid>
          </div>
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
              disabled={
                form.values?.password?.length < 8 ||
                (form.values?.password?.length >= 8 &&
                  form.values?.password !== passwordCheck) ||
                pending
              }
              onClick={form.submitForm}
              variant="contained"
              sx={{ px: 3 }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default function SignUp() {
  // const [logged, setLogged] = useState(false);
  const { profile } = useProfile();

  if (profile !== null && profile !== false) {
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
              <Logo />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="div" marginLeft="10px">
                Basil
              </Typography>
            </Grid>
          </Grid>
          <OutlinedCard />
        </Box>
      </Grid>
    </Grid>
  );
}
