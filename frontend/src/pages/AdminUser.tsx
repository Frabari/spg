import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { toast } from 'react-hot-toast';
import { AdminAppBar } from '../components/AdminAppBar';
import { useUser } from '../hooks/useUser';
import { User } from '../api/basil-api';

export const AdminUser = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { user, upsertUser } = useUser(id);
  const [dto, setDto] = useState<Partial<User>>({});

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
      .catch(e => {
        toast.error(e.message);
      });
  };

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
              <img
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
                    value={user?.name ?? ''}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Surname"
                    value={user?.surname ?? ''}
                    onChange={e => handleChange('surname', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Email"
                    value={user?.email ?? ''}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Password"
                    value={user?.password ?? ''}
                    onChange={e => handleChange('password', e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Avatar"
                    value={user?.avatar ?? ''}
                    onChange={e => handleChange('avatar', e.target.value)}
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
