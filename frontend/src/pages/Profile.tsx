import { useEffect, useState } from 'react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {
  Container,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ThemeProvider,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material/styles';
import { User } from '../api/BasilApi';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';

export default function Profile() {
  const { profile } = useProfile();
  const [dto, setDto] = useState<Partial<User>>({});

  useEffect(() => {
    setDto(profile as User);
  }, []);

  const handleChange = (key: string, value: any) => {
    setDto(_dto => ({
      ..._dto,
      [key]: value,
    }));
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
            sx={{ p: { xs: 2, sm: 3 }, py: { sm: 8 }, position: 'relative' }}
          >
            <ThemeProvider
              theme={createTheme({
                components: {
                  MuiTextField: {
                    defaultProps: {
                      fullWidth: true,
                    },
                  },
                },
              })}
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
                  display="grid"
                  gap={4}
                  gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
                >
                  <Grid item>
                    <TextField
                      disabled
                      label="Name"
                      value={dto?.name ?? ''}
                      onChange={e => handleChange('name', e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      disabled
                      label="Surname"
                      value={dto?.surname ?? ''}
                      onChange={e => handleChange('surname', e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      disabled
                      label="Email"
                      value={dto?.email ?? ''}
                      onChange={e => handleChange('email', e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      disabled
                      label="Avatar"
                      value={dto?.avatar ?? ''}
                      onChange={e => handleChange('avatar', e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      disabled
                      label="Balance"
                      value={(profile as User)?.balance ?? ''}
                      InputProps={{
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start"> € </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              disabled
                              aria-label="manage profile wallet"
                              color="success"
                              edge="end"
                            >
                              <AccountBalanceWalletIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </ThemeProvider>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
