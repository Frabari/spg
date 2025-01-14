import { addDays } from 'date-fns';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Avatar,
  Box,
  Button,
  Card,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Order, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useDate } from '../hooks/useDate';
import { useProfile } from '../hooks/useProfile';
import { useUpdateBasket } from '../hooks/useUpdateBasket';
import { NavBar } from './Navigation';

export enum DeliveryOption {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

const Checkout = () => {
  const navigate = useNavigate();
  const { data: basket, isLoading } = useBasket();
  const { mutate: updateBasket } = useUpdateBasket();
  const { data: profile } = useProfile();
  const { data: date } = useDate();
  const [check, setCheck] = useState(true);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(
    DeliveryOption.PICKUP,
  );
  const form = useFormik({
    initialValues: {
      entries: [],
      deliverAt: new Date(date.toISODate()),
      deliveryLocation: null,
      total: 0,
      insufficientBalance: false,
    } as Partial<Order>,
    onSubmit: (values, { setErrors, setSubmitting }) => {
      setSubmitting(true);
      updateBasket(values, {
        onSuccess() {
          toast.success('Basket saved!');
          navigate('/products');
        },
        onError(error: any) {
          setErrors(error.data?.constraints);
        },
        onSettled() {
          setSubmitting(false);
        },
      });
    },
  });

  useEffect(() => {
    if (basket) {
      if (basket.deliveryLocation) {
        setDeliveryOption(DeliveryOption.DELIVERY);
      } else {
        setDeliveryOption(DeliveryOption.PICKUP);
      }
      form.setValues(basket);
    }
  }, [basket]);

  const deliveryDay = (date: Date) => {
    return date.getDay() !== 3 && date.getDay() !== 4 && date.getDay() !== 5;
  };

  return (
    <>
      <NavBar onProducts={false} />
      <Box sx={{ pt: 10, pb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', pb: 2 }}>
          <Typography
            variant="h6"
            noWrap
            color="primary.main"
            fontWeight="bold"
            sx={{ fontSize: { sm: 28 }, mr: 'auto', flexGrow: 1 }}
          >
            Checkout
          </Typography>
          {deliveryOption === 'pickup' ? (
            <Button
              sx={{
                minWidth: 0,
              }}
              variant="contained"
              type="submit"
              onClick={form.submitForm}
            >
              <AddShoppingCartIcon />
              <Typography
                sx={{
                  textTransform: 'none',
                  marginLeft: 1,
                }}
              >
                Save basket
              </Typography>
            </Button>
          ) : null}
        </Box>
        <Card sx={{ p: 3 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 'bold', pb: 3 }}
          >
            Your basket
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AvatarGroup sx={{ mr: 'auto' }}>
              {basket?.entries?.map(e => (
                <Avatar key={e.product.id} src={e.product.image} />
              ))}
            </AvatarGroup>
            <Box>
              <Typography
                align="right"
                gutterBottom
                component="div"
                color="#757575"
              >
                Your balance €
                <Typography
                  fontWeight="bold"
                  align="right"
                  gutterBottom
                  component="div"
                  display="inline"
                  color="#757575"
                >
                  {basket?.user?.balance == null ? '0' : basket.user.balance}
                </Typography>
              </Typography>
              <Typography
                align="right"
                gutterBottom
                variant="h5"
                component="div"
              >
                Total €
                <Typography
                  fontWeight="bold"
                  align="right"
                  gutterBottom
                  variant="h5"
                  component="div"
                  display="inline"
                >
                  {basket?.total}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, mt: 6 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 'bold', pb: 3 }}
          >
            Delivery options
          </Typography>
          <Typography component="div" sx={{ fontSize: '15px' }}>
            Choose an option:
          </Typography>

          <ToggleButtonGroup
            value={deliveryOption}
            exclusive
            onChange={(e, value) => {
              value === DeliveryOption.PICKUP
                ? setCheck(false)
                : setCheck(true);
              setDeliveryOption(value);
              form.setFieldValue(
                'deliveryLocation',
                value === DeliveryOption.PICKUP
                  ? null
                  : basket.deliveryLocation ?? {
                      name: (profile as User).name,
                      surname: (profile as User).surname,
                      address: (profile as User)?.address?.address,
                      zipCode: (profile as User)?.address?.zipCode,
                      city: (profile as User)?.address?.city,
                      province: (profile as User)?.address?.province,
                      region: (profile as User)?.address?.region,
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
          </ToggleButtonGroup>
          {deliveryOption === DeliveryOption.DELIVERY && (
            <FormControlLabel
              control={
                <Switch
                  sx={{ m: 1, marginLeft: 10 }}
                  onChange={(_, check) => {
                    if (!check) {
                      form.setFieldValue(
                        'deliveryLocation',
                        (profile as User).address,
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
                    value={form.values?.deliveryLocation?.address ?? ''}
                    label="Address"
                    disabled={check}
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
          <Typography component="div" sx={{ py: 3, fontSize: '15px' }}>
            Delivery date:
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              renderInput={props => <TextField {...props} />}
              label="Delivery date and time"
              value={form.values?.deliverAt}
              shouldDisableDate={deliveryDay}
              minDate={new Date(date.toISODate())}
              maxDate={addDays(new Date(date.toISODate()), 7)}
              minTime={new Date(0, 0, 0, 9)}
              maxTime={new Date(0, 0, 0, 18, 0)}
              onChange={newValue => {
                form.setFieldValue('deliverAt', newValue);
              }}
            />
            <FormHelperText>{form.errors?.deliverAt}</FormHelperText>
          </LocalizationProvider>
        </Card>
        {deliveryOption === 'delivery' ? (
          <Button
            type="submit"
            sx={{
              minWidth: 0,
              float: 'right',
              mt: '16px',
            }}
            variant="contained"
            onClick={form.submitForm}
          >
            <AddShoppingCartIcon />
            <Typography
              sx={{
                textTransform: 'none',
                marginLeft: 1,
              }}
            >
              {'Save basket'}
            </Typography>
          </Button>
        ) : null}
      </Box>
    </>
  );
};

export default Checkout;
