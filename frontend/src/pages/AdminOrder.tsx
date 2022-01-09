import { ADMINS } from 'backend/dist/src/features/users/roles.enum';
import { addDays } from 'date-fns';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FormikErrors, useFormik } from 'formik';
import { Add, Save } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
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
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import {
  getUser,
  Order,
  OrderEntry,
  OrderStatus,
  Product,
  User,
} from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import ProductsGrid from '../components/ProductsGrid';
import { orderStatuses } from '../constants';
import { useOrder } from '../hooks/useOrder';
import { useProfile } from '../hooks/useProfile';
import { useUpsertOrder } from '../hooks/useUpsertOrder';
import { useUsers } from '../hooks/useUsers';
import { DeliveryOption } from './Checkout';

const statuses = Object.values(orderStatuses);

const IOSSwitch = styled((props: any) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    defaultChecked
    disableRipple
    {...props}
    onChange={p => {
      props.setCheck(p.target.checked);
    }}
  />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export const AdminOrder = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const [check, setCheck] = useState(true);
  const id = idParam === 'new' ? null : +idParam;
  const { data: order, isLoading } = useOrder(id);
  const { upsertOrder } = useUpsertOrder();
  const [user, setUser] = useState<User>();
  const { data: users } = useUsers();
  const { data: profile } = useProfile();
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectingProduct, setSelectingProduct] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(
    DeliveryOption.PICKUP,
  );
  const form = useFormik({
    initialValues: {
      user: { id: null },
      status: OrderStatus.DRAFT,
      entries: [],
      deliverAt: null,
      deliveryLocation: null,
      total: 0,
      insufficientBalance: false,
    } as Partial<Order>,
    onSubmit: (values: Partial<Order>, { setErrors }) => {
      return upsertOrder(values)
        .then(newOrder => {
          const creating = id == null;
          toast.success(`Order ${creating ? 'created' : 'updated'}`);
          if (creating) {
            navigate(`/admin/orders/${(newOrder as Order).id}`);
          } else navigate('/admin/orders');
        })
        .catch(e => {
          setErrors(e.data?.constraints);
        });
    },
  });

  useEffect(() => {
    if (
      form.values.user.id !== null &&
      ADMINS.includes((profile as User).role)
    ) {
      getUser(form.values.user.id).then(u => setUser(u));
    }
  }, [form.values.user.id]);

  useEffect(() => {
    if (
      deliveryOption === 'delivery' &&
      ADMINS.includes((profile as User).role)
    ) {
      getUser(form.values.user.id).then(u => {
        form.setFieldValue('deliveryLocation', u.address);
      });
    }
  }, [deliveryOption]);

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

  const deliveryDay = (date: Date) => {
    return date.getDay() !== 3 && date.getDay() !== 4 && date.getDay() !== 5;
  };

  return (
    <>
      <AdminAppBar handleDrawerToggle={props.handleDrawerToggle}>
        <IconButton onClick={() => navigate('/admin/orders')}>
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
          Orders / {order ? order.id : 'New'}
        </Typography>
        <Button
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          type="submit"
          variant="contained"
          disabled={isLoading}
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
        sx={{
          p: { xs: 2, sm: 3 },
          pt: { sm: 0 },
          flexGrow: 1,
        }}
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
                  disabled={isLoading}
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
                  disabled={id == null || isLoading}
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
                      <FormControl error={!!quantityError} disabled={isLoading}>
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
                        secondary={`€ ${e.product.price} - ${e.product.baseUnit}`}
                      />
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })}
            </List>
            <Button
              variant="text"
              onClick={() => {
                setSelectingProduct(true);
              }}
            >
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
            <ToggleButtonGroup
              disabled={form.values.user.id === null}
              value={deliveryOption}
              exclusive
              onChange={(event, value) => {
                value === DeliveryOption.PICKUP
                  ? setCheck(false)
                  : setCheck(true);
                setDeliveryOption(value);
                form.setFieldValue(
                  'deliveryLocation',
                  value === DeliveryOption.PICKUP
                    ? null
                    : order?.deliveryLocation ?? {
                        name: (user as User).name,
                        surname: (user as User).surname,
                        address: (user as User)?.address.address,
                        zipCode: (user as User)?.address.zipCode,
                        city: (user as User)?.address.city,
                        province: (user as User)?.address.province,
                        region: (user as User)?.address.region,
                      },
                );
              }}
              aria-label="delivery"
              sx={{ mt: 2, borderRadius: '16px' }}
            >
              <ToggleButton value={DeliveryOption.PICKUP}>
                I'll pick it up
              </ToggleButton>
              <ToggleButton value={DeliveryOption.DELIVERY}>
                Deliver it
              </ToggleButton>
              {deliveryOption === DeliveryOption.DELIVERY && (
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1, marginLeft: 10 }}
                      setCheck={() => {
                        if (!check) {
                          form.setFieldValue(
                            'deliveryLocation',
                            (user as User).address,
                          );
                        } else {
                          form.setFieldValue('deliveryLocation', null);
                        }
                        setCheck(!check);
                      }}
                    />
                  }
                  label="Default address"
                />
              )}
            </ToggleButtonGroup>
            {deliveryOption === DeliveryOption.DELIVERY && (
              <Grid
                container
                direction="row"
                spacing={2}
                gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
                sx={{ pt: 3 }}
              >
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.name}
                  >
                    <InputLabel htmlFor="outlined-adornment-address">
                      Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-name"
                      name="deliveryLocation.name"
                      disabled={check}
                      value={form.values?.deliveryLocation?.name ?? ''}
                      label="Name"
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.name}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.surname}
                  >
                    <InputLabel htmlFor="outlined-adornment-address">
                      Surname
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-surname"
                      name="deliveryLocation.surname"
                      disabled={check}
                      value={form.values?.deliveryLocation?.surname ?? ''}
                      label="Surname"
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.surname}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.address}
                  >
                    <InputLabel htmlFor="outlined-adornment-address">
                      Address
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-address"
                      name="deliveryLocation.address"
                      disabled={check}
                      value={form.values?.deliveryLocation?.address ?? ''}
                      label="Address"
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.address}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.zipCode}
                  >
                    <InputLabel htmlFor="outlined-adornment-zipcode">
                      Zip code
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-zipcode"
                      label="Zip code"
                      name="deliveryLocation.zipCode"
                      disabled={check}
                      value={form.values?.deliveryLocation?.zipCode ?? ''}
                      onChange={form.handleChange}
                    />
                  </FormControl>
                  <FormHelperText>
                    {form.errors?.deliveryLocation?.zipCode}
                  </FormHelperText>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.city}
                  >
                    <InputLabel htmlFor="outlined-adornment-city">
                      City
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-city"
                      label="City"
                      name="deliveryLocation.city"
                      disabled={check}
                      value={form.values?.deliveryLocation?.city ?? ''}
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.city}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.province}
                  >
                    <InputLabel htmlFor="outlined-adornment-province">
                      Province
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-province"
                      label="Province"
                      name="deliveryLocation.province"
                      disabled={check}
                      value={form.values?.deliveryLocation?.province ?? ''}
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.province}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={isLoading}
                    error={!!form.errors?.deliveryLocation?.region}
                  >
                    <InputLabel htmlFor="outlined-adornment-region">
                      Region
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-region"
                      label="Region"
                      name="deliveryLocation.region"
                      disabled={check}
                      value={form.values?.deliveryLocation?.region ?? ''}
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.region}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography component="div" sx={{ py: 3, fontSize: '15px' }}>
                Delivery date:
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={props => <TextField {...props} />}
                  label="Delivery date and time"
                  value={form.values?.deliverAt}
                  shouldDisableDate={deliveryDay}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 7)}
                  minTime={new Date(0, 0, 0, 9)}
                  maxTime={new Date(0, 0, 0, 18, 0)}
                  onChange={newValue => {
                    form.setFieldValue('deliverAt', newValue);
                  }}
                />
                <FormHelperText>{form.errors?.deliverAt}</FormHelperText>
              </LocalizationProvider>
            </Grid>
          </Container>
        </Paper>
      </Box>

      <Drawer
        sx={{ width: '300px' }}
        anchor="right"
        open={selectingProduct}
        onClose={() => setSelectingProduct(false)}
      >
        <Box sx={{ width: { xs: '100%' } }}>
          <Grid container direction="row" spacing={1}>
            <Grid item xs={1}>
              <IconButton
                sx={{ margin: 1.5 }}
                onClick={() => {
                  setSelectingProduct(false);
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              <Typography
                variant="h5"
                color="primary.main"
                sx={{ p: 3, fontWeight: 'bold' }}
              >
                Select a product
              </Typography>
            </Grid>
          </Grid>
          <ProductsGrid onSelect={onProductSelected} />
        </Box>
      </Drawer>
    </>
  );
};
