import { MouseEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { getGlobalState } from '../App';
import { User } from '../api/BasilApi';
import { Logo } from '../components/Logo';
import { useUser } from '../hooks/useUser';

function OutlinedCard() {
  const [passwordCheck, setPasswordCheck] = useState('');
  const [dto, setDto] = useState<Partial<User>>({});
  const { upsertUser } = useUser(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleChange = (key: string, value: any) => {
    setDto(_dto => ({ ..._dto, [key]: value }));
  };

  const handlePasswordCheck = (value: string) => {
    setPasswordCheck(value);
  };

  const handleRegistration = () => {
    upsertUser(dto)
      .then(newUser => {
        toast.success(`Welcome ${newUser.name}!`);
        navigate('/login');
      })
      .catch(() => {
        // noop
      });
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
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-name">
                    Name
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name"
                    onChange={e => handleChange('name', e.target.value)}
                    label="Name"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-surname">
                    Surname
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-surname"
                    onChange={e => handleChange('surname', e.target.value)}
                    label="Surname"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-email">
                    Email
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email"
                    onChange={e => handleChange('email', e.target.value)}
                    label="Email"
                  />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={show ? 'text' : 'password'}
                    value={dto?.password ?? ''}
                    onChange={e => handleChange('password', e.target.value)}
                    label="Password"
                  />
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
                <Collapse in={dto?.password?.length < 8}>
                  <Alert severity="error">
                    Password must be of at least 8 characters
                  </Alert>
                </Collapse>
                <Collapse
                  in={
                    dto?.password?.length >= 8 &&
                    dto?.password !== passwordCheck
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
              disabled={
                dto?.password?.length < 8 ||
                (dto?.password?.length >= 8 && dto?.password !== passwordCheck)
              }
              variant="contained"
              onClick={handleRegistration}
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
  const user = getGlobalState('user');

  if (user !== null && user !== false) {
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
