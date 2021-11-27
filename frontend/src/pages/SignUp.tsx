import { MouseEvent, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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
import { User } from '../api/BasilApi';
import { Logo } from '../components/Logo';
import { UserContext } from '../contexts/user';
import { useUser } from '../hooks/useUser';

function OutlinedCard() {
  const [dto, setDto] = useState<Partial<User>>({});
  const { upsertUser } = useUser(null);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleChange = (key: string, value: any) => {
    setDto(_dto => ({ ..._dto, [key]: value }));
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
            <Grid container rowSpacing={1} direction="column">
              <Grid item>
                <TextField
                  label="Name"
                  fullWidth
                  onChange={e => handleChange('name', e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Surname"
                  fullWidth
                  onChange={e => handleChange('surname', e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Email"
                  fullWidth
                  onChange={e => handleChange('email', e.target.value)}
                />
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
                </FormControl>
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
  const { user } = useContext(UserContext);

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
