import { useParams } from 'react-router-dom';
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
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material/styles';
import { AdminAppBar } from '../components/AdminAppBar';
import { useProduct } from '../hooks/useProduct';

export const AdminProduct = (props: { handleDrawerToggle: () => void }) => {
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { product } = useProduct(id);

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
          Products / {product?.name}
        </Typography>
        <Button
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          variant="contained"
          disabled
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
          className="AdminProduct"
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
                src={product?.image}
                alt="product image"
                style={{
                  width: '250px',
                  height: '250px',
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
                  <TextField label="Name" value={product?.name ?? ''} />
                </Grid>
                <Grid item>
                  <TextField
                    label="Description"
                    value={product?.description ?? ''}
                  />
                </Grid>
                <Grid item>
                  <TextField label="Price" value={product?.price ?? ''} />
                </Grid>
                <Grid item>
                  <TextField
                    label="Available"
                    value={product?.available ?? ''}
                  />
                </Grid>
                <Grid item>
                  <TextField label="Reserved" value={product?.reserved ?? ''} />
                </Grid>
                <Grid item>
                  <TextField label="Sold" value={product?.sold ?? ''} />
                </Grid>
                <Grid item>
                  <TextField
                    label="Category"
                    value={product?.category.name ?? ''}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    label="Farmer"
                    value={
                      product?.farmer.name + ' ' + product?.farmer.surname ?? ''
                    }
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
