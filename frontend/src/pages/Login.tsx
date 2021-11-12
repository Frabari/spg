import { MouseEvent, ChangeEvent, useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Navigate } from 'react-router-dom';
import { getMe, login } from '../api/basil-api';
import { UserContext } from '../contexts/user';
import { PendingStateContext } from '../contexts/pending';
import { Logo } from '../components/Logo';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

interface State {
  password: string;
  showPassword: boolean;
}

function OutlinedCard(props: any) {
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
  });
  const [email, setEmail] = useState('');

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleEmail = (email: string) => {
    setEmail(email);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          padding="1rem"
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <Grid container rowSpacing={1} direction="column">
              <Grid item>
                <TextField
                  label="Email"
                  onChange={e => handleEmail(e.target.value)}
                />
              </Grid>
              <Grid item>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </Box>
      </CardContent>
      <CardActions>
        <Box marginX="auto" padding="1rem">
          <Button onClick={() => props.handleLogin(email, values.password)}>
            Login
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

export default function Login(props: any) {
  // const [logged, setLogged] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const { setPending } = useContext(PendingStateContext);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      setPending(true);
      getMe()
        .then(setUser)
        .catch(() => setUser(false))
        .finally(() => setPending(false));
    } catch (e) {
      toast.error((e as ApiException).message);
    }
  };

  if (user) {
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
          <OutlinedCard handleLogin={handleLogin} />
        </Box>
      </Grid>
    </Grid>
  );
}
