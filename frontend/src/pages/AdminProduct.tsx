import { useEffect, useState } from 'react';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { Inventory, Save } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { OrderEntryStatus, Product, Role, User } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useCategories } from '../hooks/useCategories';
import { useProduct } from '../hooks/useProduct';
import { useProductOrderEntries } from '../hooks/useProductOrderEntries';
import { useProfile } from '../hooks/useProfile';
import { useUsers } from '../hooks/useUsers';

export const AdminProduct = (props: { handleDrawerToggle: () => void }) => {
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const [farmers, setFarmers] = useState(null);
  const { product, upsertProduct } = useProduct(id, true);
  const { categories } = useCategories();
  const { entries, setEntries } = useProductOrderEntries(product?.id);
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
      farmer: null,
      category: null,
    } as Partial<Product>,
    onSubmit: (values: Partial<Product>, { setErrors }) => {
      return upsertProduct(values)
        .then(newProduct => {
          const creating = id == null;
          toast.success(`Product ${creating ? 'created' : 'updated'}`);
          if (creating) {
            navigate(`/admin/products/${(newProduct as Product).id}`);
          } else navigate('/admin/products');
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
        <IconButton onClick={() => navigate('/admin/products')}>
          <ArrowBackIcon />
        </IconButton>
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
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' } }}
          className="save-icon-button"
          onClick={form.submitForm}
          type="submit"
        >
          <Save />
        </IconButton>
        <Button
          sx={{
            display: { xs: 'none', md: 'flex' },
          }}
          variant="contained"
          startIcon={<Save />}
          onClick={form.submitForm}
          type="submit"
        >
          <Typography display="inline" sx={{ textTransform: 'none' }}>
            Save Changes
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
          <div className="container relative">
            <Avatar
              src={product?.image}
              alt="profile avatar"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '40px',
              }}
            >
              <Inventory />
            </Avatar>
            <Grid
              container
              direction="row"
              columnSpacing={4}
              rowSpacing={2}
              gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
            >
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.name}
                >
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.baseUnit}
                >
                  <InputLabel htmlFor="product-baseUnit">Base Unit</InputLabel>
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.image}
                >
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.price}
                >
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.available}
                >
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl variant="outlined" fullWidth>
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.category}
                >
                  <TextField
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
                  <FormHelperText>{form.errors?.category}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl
                  required
                  error={!!form.errors?.farmer}
                  variant="outlined"
                  fullWidth
                >
                  <TextField
                    disabled={(profile as User)?.role === Role.FARMER}
                    name="farmer"
                    label="Farmer"
                    select={(profile as User)?.role !== Role.FARMER}
                    id="farmer"
                    value={
                      form.values?.farmer
                        ? form.values?.farmer?.name +
                          ' ' +
                          form.values?.farmer?.surname
                        : ''
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
            <Grid container display="grid" marginTop="32px">
              <Grid item>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={!!form.errors?.description}
                >
                  <InputLabel htmlFor="product-description">
                    Description
                  </InputLabel>
                  <OutlinedInput
                    multiline
                    id="product-description"
                    type="text"
                    name="description"
                    onChange={form.handleChange}
                    label="Description"
                    value={form.values?.description ?? ''}
                  />
                  <FormHelperText>{form.errors?.description}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item sx={{ p: 2, pt: 0 }}>
              <Typography
                variant="h6"
                noWrap
                component="h1"
                color="primary.secondary"
                sx={{
                  mt: 2,
                  minWidth: '6rem',
                  fontSize: { sm: 20 },
                  mr: 'auto',
                }}
              >
                This product is contained in {entries.length} order entries
              </Typography>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                {(profile as User).role === Role.MANAGER && (
                  <Button
                    type="submit"
                    variant="outlined"
                    color="warning"
                    sx={{ px: 3 }}
                    onClick={ev => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setEntries({ status: OrderEntryStatus.DRAFT });
                    }}
                  >
                    Draft
                  </Button>
                )}
                {((profile as User).role === Role.MANAGER ||
                  (profile as User).role === Role.FARMER) && (
                  <Button
                    type="submit"
                    variant="outlined"
                    color="error"
                    onClick={ev => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setEntries({ status: OrderEntryStatus.CONFIRMED });
                    }}
                    sx={{ px: 3 }}
                  >
                    Confirm
                  </Button>
                )}
                {((profile as User).role === Role.MANAGER ||
                  (profile as User).role === Role.WAREHOUSE_MANAGER) && (
                  <Button
                    type="submit"
                    variant="outlined"
                    sx={{ px: 3 }}
                    onClick={ev => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setEntries({ status: OrderEntryStatus.DELIVERED });
                    }}
                  >
                    Delivered
                  </Button>
                )}
              </ButtonGroup>
            </Grid>
          </div>
        </Paper>
      </Box>
    </>
  );
};
