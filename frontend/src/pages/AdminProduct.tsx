import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Save } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Paper,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material/styles';
import { Product } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useProduct } from '../hooks/useProduct';

export const AdminProduct = (props: { handleDrawerToggle: () => void }) => {
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { product, upsertProduct, error } = useProduct(id);
  const navigate = useNavigate();
  const form = useFormik({
    initialValues: {
      farmer: { id: null },
      name: null,
      description: null,
      price: null,
      available: null,
      reserved: null,
      sold: null,
      category: { id: null },
    } as Partial<Product>,
    validate: () => error?.data?.constraints ?? {},
    onSubmit: (values: Partial<Product>, { setErrors }) => {
      return upsertProduct(values)
        .then(newProduct => {
          const creating = id == null;
          toast.success(`Product ${creating ? 'created' : 'updated'}`);
          if (creating) {
            navigate(`/admin/products/${(newProduct as Product).id}`);
          }
        })
        .catch(e => {
          setErrors(e.data?.constraints);
        });
    },
  });

  useEffect(() => {
    if (product) {
      form.setValues(product);
    }
  }, [product]);

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
          onClick={form.submitForm}
          type="submit"
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
                  <FormControl required error={!!form.errors?.name}>
                    <InputLabel id="product-name">Name</InputLabel>
                    <OutlinedInput
                      name="name"
                      onChange={form.handleChange}
                      label="Name"
                      value={form.values?.name ?? ''}
                    />
                    <FormHelperText>{form.errors?.name}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.description}>
                    <InputLabel id="product-description">
                      Description
                    </InputLabel>
                    <OutlinedInput
                      name="description"
                      onChange={form.handleChange}
                      label="Description"
                      value={form.values?.description ?? ''}
                    />
                    <FormHelperText>{form.errors?.description}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.price}>
                    <InputLabel id="product-price">Price</InputLabel>
                    <OutlinedInput
                      onChange={form.handleChange}
                      label="Price"
                      value={form.values?.price ?? ''}
                      name="price"
                    />
                    <FormHelperText>{form.errors?.price}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.available}>
                    <InputLabel id="product-available">Available</InputLabel>
                    <OutlinedInput
                      label="Available"
                      value={form.values?.available ?? ''}
                      onChange={form.handleChange}
                      name="available"
                    />
                    <FormHelperText>{form.errors?.price}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.reserved}>
                    <InputLabel id="product-reserved">Reserved</InputLabel>
                    <OutlinedInput
                      name="reserved"
                      onChange={form.handleChange}
                      label="Reserved"
                      value={form.values?.reserved ?? ''}
                    />
                    <FormHelperText>{form.errors?.reserved}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.sold}>
                    <InputLabel id="product-sold">Sold</InputLabel>
                    <OutlinedInput
                      name="sold"
                      onChange={form.handleChange}
                      label="Sold"
                      value={form.values?.sold ?? ''}
                    />
                    <FormHelperText>{form.errors?.sold}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.category}>
                    <InputLabel id="product-category">Category</InputLabel>
                    <OutlinedInput
                      name="category"
                      label="Category"
                      value={form.values?.category?.name ?? ''}
                    />
                    <FormHelperText>{form.errors?.sold}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.farmer}>
                    <InputLabel id="product-farmer">Farmer</InputLabel>
                    <OutlinedInput
                      name="farmer"
                      label="Farmer"
                      value={
                        form.values?.farmer?.name +
                          ' ' +
                          form.values?.farmer?.surname ?? ''
                      }
                    />
                    <FormHelperText>{form.errors?.farmer}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </ThemeProvider>
        </Paper>
      </Box>
    </>
  );
};
