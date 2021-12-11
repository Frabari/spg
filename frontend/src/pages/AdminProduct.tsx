import { useEffect, useState } from 'react';
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
  MenuItem,
  OutlinedInput,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material/styles';
import { Product, Role, User } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useCategories } from '../hooks/useCategories';
import { useProduct } from '../hooks/useProduct';
import { useProfile } from '../hooks/useProfile';
import { useUsers } from '../hooks/useUsers';

export const AdminProduct = (props: { handleDrawerToggle: () => void }) => {
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const [farmers, setFarmers] = useState(null);
  const { product, upsertProduct } = useProduct(id);
  const { categories } = useCategories();
  const { users } = useUsers();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const form = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: null,
      available: null,
      baseUnit: null,
    } as Partial<Product>,
    onSubmit: (values: Partial<Product>, { setErrors }) => {
      upsertProduct(values)
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
    if (users) {
      setFarmers(users.filter(u => u.role === Role.FARMER));
    }
  }, [users]);

  useEffect(() => {
    if (product) {
      form.setValues(product);
    } else {
      if ((profile as User)?.role === Role.FARMER) {
        form.setFieldValue('farmer', profile as User);
      }
    }
  }, [product]);

  const handleChangeFarmer = (value: string) => {
    const f = farmers.find((fa: User) => fa.name + ' ' + fa.surname === value);
    form.setFieldValue('farmer', f);
  };

  const handleChangeCategory = (value: string) => {
    form.setFieldValue(
      'category',
      categories.find(c => c.name === value),
    );
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
                    <InputLabel htmlFor="product-name">Name</InputLabel>
                    <OutlinedInput
                      id="name"
                      type="text"
                      name="name"
                      onChange={form.handleChange}
                      label="Name"
                      value={form.values?.name}
                    />
                    <FormHelperText>{form.errors?.name}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.description}>
                    <InputLabel htmlFor="product-description">
                      Description
                    </InputLabel>
                    <OutlinedInput
                      id="description"
                      type="text"
                      name="description"
                      onChange={form.handleChange}
                      label="Description"
                      value={form.values?.description ?? ''}
                    />
                    <FormHelperText>{form.errors?.description}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.baseUnit}>
                    <InputLabel htmlFor="product-baseUnit">
                      Base Unit
                    </InputLabel>
                    <OutlinedInput
                      id="baseUnit"
                      type="text"
                      name="baseUnit"
                      onChange={form.handleChange}
                      label="Base Unit"
                      value={form.values?.baseUnit ?? ''}
                    />
                    <FormHelperText>{form.errors?.baseUnit}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.image}>
                    <InputLabel htmlFor="product-image">Image</InputLabel>
                    <OutlinedInput
                      id="image"
                      type="text"
                      name="image"
                      onChange={form.handleChange}
                      label="Image"
                      value={form.values?.image ?? ''}
                    />
                    <FormHelperText>{form.errors?.image}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl required error={!!form.errors?.price}>
                    <InputLabel id="product-price">Price</InputLabel>
                    <OutlinedInput
                      id="price"
                      type="number"
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
                      id="available"
                      type="number"
                      label="Available"
                      value={form.values?.available ?? ''}
                      onChange={form.handleChange}
                      name="available"
                    />
                    <FormHelperText>{form.errors?.available}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel id="product-reserved">Reserved</InputLabel>
                    <OutlinedInput
                      id="reserved"
                      type="number"
                      name="reserved"
                      onChange={form.handleChange}
                      label="Reserved"
                      value={form.values?.reserved ?? ''}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel id="product-sold">Sold</InputLabel>
                    <OutlinedInput
                      id="sold"
                      type="number"
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
                    <TextField
                      sx={{ width: '223px' }}
                      id="category"
                      select
                      name="category"
                      label="Category"
                      value={form.values?.category?.name ?? ''}
                      onChange={e => handleChangeCategory(e.target.value)}
                    >
                      {categories.map(c => (
                        <MenuItem key={c.id} value={c.name}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FormHelperText>{form.errors?.sold}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <TextField
                      sx={{ width: '223px' }}
                      disabled={(profile as User)?.role === Role.FARMER}
                      name="farmer"
                      label="Farmer"
                      select={(profile as User)?.role !== Role.FARMER}
                      id="farmer"
                      value={
                        form.values?.farmer?.name +
                        ' ' +
                        form.values?.farmer?.surname
                      }
                      onChange={e => handleChangeFarmer(e.target.value)}
                    >
                      {farmers?.map((f: User) => (
                        <MenuItem key={f.id} value={f.name + ' ' + f.surname}>
                          {f.name} {f.surname}
                        </MenuItem>
                      ))}
                    </TextField>
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
