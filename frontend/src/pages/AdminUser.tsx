import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { toast } from 'react-hot-toast';
import { AdminAppBar } from '../components/AdminAppBar';
import { useUser } from '../hooks/useUser';
import { User } from '../api/BasilApi';
import Avatar from '@mui/material/Avatar';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Balance } from './Balance';
import { useTransaction } from '../hooks/useTransaction';

export const AdminUser = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { user, upsertUser, load } = useUser(id);
  const [dto, setDto] = useState<Partial<User>>({});
  const [open, setOpen] = useState(false);
  const { upsertTransaction } = useTransaction();

  const handleChange = (key: string, value: any) => {
    setDto(_dto => ({
      ..._dto,
      [key]: value,
    }));
  };

  const saveChanges = () => {
    upsertUser(dto)
      .then(newUser => {
        toast.success('User created');
        navigate(`/admin/users/${(newUser as User).id}`);
      })
      .catch(() => {
        // noop
      });
  };

  const change = (add: boolean, amount: number) => {
    if (amount > 0) {
      amount = add ? amount : -amount;
      upsertTransaction({
        user: { id: user.id } as User,
        amount,
      })
        .then(() => {
          load();
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

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    setDto(user);
  }, [user]);

  return (
    <>
      <AdminAppBar handleDrawerToggle={props.handleDrawerToggle}>
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
        <Button
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          variant="contained"
          onClick={saveChanges}
          disabled={user != null}
        >
          <Save />
          <Typography
            sx={{
              display: { xs: 'none', sm: 'inline' },
              textTransform: 'none',
            }}
          >
            Save changes
          </Typography>
        </Button>
      </AdminAppBar>
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
                src={user?.avatar}
                alt="user avatar"
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
                    label="Name"
                    value={dto?.name ?? ''}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Surname"
                    value={dto?.surname ?? ''}
                    onChange={e => handleChange('surname', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Email"
                    value={dto?.email ?? ''}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Password"
                    value={dto?.password ?? ''}
                    onChange={e => handleChange('password', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Avatar"
                    value={dto?.avatar ?? ''}
                    onChange={e => handleChange('avatar', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Balance"
                    value={user?.balance ?? ''}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start"> € </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            disabled={idParam === 'new'}
                            aria-label="manage user wallet"
                            color="success"
                            edge="end"
                            onClick={handleOpen}
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
    </>
  );
};
