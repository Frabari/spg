import { addDays } from 'date-fns';
import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { FormikErrors, useFormik } from 'formik';
import { Save } from '@mui/icons-material';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Avatar,
  Box,
  Button,
  Chip,
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
  OutlinedInput,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import {
  Order,
  OrderEntry,
  OrderEntryStatus,
  OrderStatus,
  Product,
} from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import ProductsGrid from '../components/ProductsGrid';
import { useOrder } from '../hooks/useOrder';
import { useProfile } from '../hooks/useProfile';
import { useUpsertOrder } from '../hooks/useUpsertOrder';
import { DeliveryOption } from './Checkout';

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

const steps = (status?: OrderStatus) => [
  {
    label: 'Locked',
    status: OrderStatus.LOCKED,
    description: `Your order has been created.`,
  },
  {
    label: 'Pending Payment',
    status: OrderStatus.PENDING_PAYMENT,
    description: 'Your order is in pending payment.',
  },
  {
    label: 'Paid',
    status: OrderStatus.PAID,
    description: `Your order has been paid.`,
  },
  {
    label: 'Prepared',
    status: OrderStatus.PREPARED,
    description: `Your order has been prepared.`,
  },
  {
    label: 'Delivering',
    status: OrderStatus.DELIVERING,
    description: `Your order is delivering.`,
  },
  ...(status === OrderStatus.PENDING_CANCELLATION ||
  status === OrderStatus.CANCELED
    ? [
        {
          label: 'Pending Cancellation',
          status: OrderStatus.PENDING_CANCELLATION,
          description: `Your order is in pending cancellation.`,
        },
        {
          label: 'Cancelled',
          status: OrderStatus.CANCELED,
          description: `Your order has been canceled.`,
        },
      ]
    : [
        {
          label: 'Completed',
          status: OrderStatus.COMPLETED,
          description: `Your order is completed.`,
        },
      ]),
];

export const CustomerOrder = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { id: idParam } = useParams();
  const [check, setCheck] = useState(true);
  const id = idParam === 'new' ? null : +idParam;
  const { data: order, isLoading } = useOrder(id);
  const { upsertOrder } = useUpsertOrder();
  const { data: profile } = useProfile();
  const [activeStep, setActiveStep] = useState(0);
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

  const statuses = steps(order?.status);

  useEffect(() => {
    if (deliveryOption === DeliveryOption.DELIVERY) {
      if (order.deliveryLocation) {
        form.setFieldValue('deliveryLocation', order.deliveryLocation);
      }
    }
  }, [deliveryOption]);

  useEffect(() => {
    if (order) {
      form.setValues(order);
      setActiveStep(statuses.findIndex(step => step.status === order?.status));
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
              Status
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stepper activeStep={activeStep}>
              {statuses.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    error={
                      step.status === OrderStatus.PENDING_CANCELLATION ||
                      step.status === OrderStatus.CANCELED
                    }
                    optional={
                      index === activeStep ? (
                        <Typography
                          color={
                            step.status === OrderStatus.PENDING_CANCELLATION ||
                            step.status === OrderStatus.CANCELED
                              ? 'error'
                              : 'success'
                          }
                          variant="caption"
                        >
                          {step.description}
                        </Typography>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

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
                          disabled
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
                      {e.status === OrderEntryStatus.DRAFT && (
                        <Chip color="warning" label="Not confirmed" />
                      )}
                    </ListItem>
                    <Divider />
                  </Fragment>
                );
              })}
            </List>

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
                        name: profile?.name,
                        surname: profile?.surname,
                        address: profile?.address?.address,
                        zipCode: profile?.address?.zipCode,
                        city: profile?.address?.city,
                        province: profile?.address?.province,
                        region: profile?.address?.region,
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
                            profile.address,
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
