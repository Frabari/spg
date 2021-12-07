import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FormikErrors, useFormik } from 'formik';
import { Add, Save } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Order, OrderEntry, OrderStatus, Product } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import ProductsGrid from '../components/ProductsGrid';
import { orderStatuses } from '../constants';
import { useOrder } from '../hooks/useOrder';
import { useUsers } from '../hooks/useUsers';

const statuses = Object.values(orderStatuses);

export const AdminOrder = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const id = idParam === 'new' ? null : +idParam;
  const { order, upsertOrder, pending } = useOrder(id);
  const { users } = useUsers();
  const [selectingProduct, setSelectingProduct] = useState(false);
  const form = useFormik({
    initialValues: {
      user: { id: null },
      status: OrderStatus.DRAFT,
      entries: [],
    } as Partial<Order>,
    onSubmit: (values: Partial<Order>, { setErrors }) =>
      upsertOrder(values)
        .then(newOrder => {
          const creating = id == null;
          toast.success(`Order ${creating ? 'created' : 'updated'}`);
          if (creating) {
            navigate(`/admin/orders/${(newOrder as Order).id}`);
          }
        })
        .catch(e => {
          setErrors(e.data?.constraints);
        }),
  });

  useEffect(() => {
    if (order) {
      form.setValues(order);
    }
  }, [order]);

  const onProductSelected = (product: Product) => {
    setSelectingProduct(false);
    const newValues = { ...(form.values ?? {}) };
    const existingEntry = newValues.entries?.find(
      e => e.product.id === product.id,
    );
    if (existingEntry) {
      if (existingEntry.quantity >= product.available) {
        toast.error(
          `You have already selected maximum available quantity for ${product.name}.`,
        );
        return;
      }
      ++existingEntry.quantity;
    } else {
      newValues.entries = (newValues.entries ?? []).concat({
        product,
        quantity: 1,
      });
    }
    form.setValues(newValues);
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
          Orders / {order ? order.id : 'New'}
        </Typography>
        <Button
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          variant="contained"
          disabled={pending}
          onClick={form.submitForm}
          startIcon={<Save />}
        >
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
        <Paper sx={{ py: { xs: 2, sm: 4 } }}>
          <Container>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Main options
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item>
                <FormControl
                  sx={{ width: 250 }}
                  error={!!form.errors?.user}
                  disabled={pending}
                >
                  <InputLabel id="order-user">User</InputLabel>
                  <Select
                    labelId="order-user"
                    label="User"
                    required
                    value={
                      users?.length && form.values?.user
                        ? form.values?.user?.id
                        : ''
                    }
                    name="user.id"
                    onChange={form.handleChange}
                  >
                    <MenuItem value="">Select a user</MenuItem>
                    {users?.map(u => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name} {u.surname}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{form.errors?.user}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl
                  sx={{ width: 250 }}
                  error={!!form.errors?.status}
                  disabled={id == null || pending}
                >
                  <InputLabel id="order-status">Status</InputLabel>
                  <Select
                    labelId="order-status"
                    label="Status"
                    name="status"
                    value={id == null ? 'draft' : form.values?.status ?? ''}
                    onChange={form.handleChange}
                  >
                    {statuses.map(s => (
                      <MenuItem key={s.key} value={s.key}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{form.errors?.status}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Typography
              variant="h5"
              component="h2"
              sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}
            >
              Products
            </Typography>
            <Divider />

            <List>
              {form.values?.entries?.map((e, ei) => {
                const entryField = `entries[${ei}].quantity`;
                const quantityError = (
                  form.errors?.entries?.[ei] as FormikErrors<OrderEntry>
                )?.quantity;
                return (
                  <Fragment key={e.product.id}>
                    <ListItem>
                      <FormControl error={!!quantityError} disabled={pending}>
                        <TextField
                          sx={{ width: '100px', mr: 2, pb: 0 }}
                          type="number"
                          size="small"
                          label="Quantity"
                          value={e.quantity ?? ''}
                          name={entryField}
                          onChange={event => {
                            const value = +event.target.value;
                            if (value === 0) {
                              form.setValues({
                                ...form.values,
                                entries:
                                  form.values?.entries?.filter(
                                    oe => oe !== e,
                                  ) ?? [],
                              });
                            } else {
                              form.setFieldValue(entryField, value);
                            }
                          }}
                        />
                        <FormHelperText>{quantityError}</FormHelperText>
                      </FormControl>
                      <ListItemAvatar>
                        <Avatar src={e.product.image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={e.product.name}
                        secondary={`€ ${e.product.price}/${e.product.unitOfMeasure}`}
                      />
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })}
            </List>
            <Button variant="text" onClick={() => setSelectingProduct(true)}>
              <Add />
              Add product
            </Button>

            <Typography
              variant="h5"
              component="h2"
              sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}
            >
              Delivery/pickup
            </Typography>
            <Divider />
          </Container>
        </Paper>
      </Box>

      <Drawer
        sx={{ width: '300px' }}
        anchor="right"
        open={selectingProduct}
        onClose={() => setSelectingProduct(false)}
      >
        <Box sx={{ width: { xs: '60vw' } }}>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ p: 3, fontWeight: 'bold' }}
          >
            Select a product
          </Typography>
          <ProductsGrid onSelect={onProductSelected} />
        </Box>
      </Drawer>
    </>
  );
};
