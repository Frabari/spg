import * as React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  TextField,
  Grid,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface State {
  password: string;
  showPassword: boolean;
}

function OutlinedCard() {
  const [values, setValues] = React.useState<State>({
    password: '',
    showPassword: false,
  });

  const handleChange = (prop: keyof State) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <Card variant="outlined">
      <React.Fragment>
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
              <Grid container rowSpacing={2} direction="column">
                <Grid item>
                  <TextField label="Email"></TextField>
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
            <Button>Login</Button>
          </Box>
        </CardActions>
      </React.Fragment>
    </Card>
  );
}

export default function Login(props: any) {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', backgroundColor: "#fafafa" }}
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 456 456"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="228" cy="228" r="228" fill="#5DD886" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M28.708 338.84C23.658 272.315 68.3297 45.5122 392.5 143C355.447 140.27 330.321 190.357 307.011 236.824C300.438 249.926 294.01 262.739 287.5 274C267.121 319.424 187.298 423.278 89.2562 408.94C64.6032 390.008 43.9301 366.151 28.708 338.84Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M84.1488 404.901C76.1242 398.368 68.5525 391.299 61.4883 383.75C65.8644 335.83 80.2611 283.425 109.5 248.5C108.39 223.065 109.299 210.285 113 189.5C116.216 204.759 118.885 213.096 127.5 227C143.834 210.833 192.8 178.3 258 177.5C247 180 218.8 188.9 194 204.5C199.401 210.123 204.063 213.219 219.5 218.5C194.982 221.303 185.461 220.673 170.5 218.5C154.81 231.397 124.626 264.209 113 291.5C133.678 295.835 145.731 297.699 170.5 297C142.278 308.958 127.149 313.369 101 318.5C95.8675 331.565 85.509 361.179 84.1488 404.901Z"
                  fill="#5DD886"
                />
              </svg>
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