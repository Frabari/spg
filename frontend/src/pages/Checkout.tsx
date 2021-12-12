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
} from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Order, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';

export enum DeliveryOption {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

export default function Checkout() {
  const navigate = useNavigate();
  const { basket, updateBasket, pending } = useBasket();
  const { profile } = useProfile();
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>(
    DeliveryOption.PICKUP,
  );
  const form = useFormik({
    initialValues: {
      entries: [],
      deliverAt: null,
      deliveryLocation: null,
      total: 0,
      insufficientBalance: false,
    } as Partial<Order>,
    onSubmit: (values, { setErrors }) => {
      return updateBasket(values)
        .then(b => {
          toast.success('Basket saved!');
          navigate('/products');
        })
        .catch(e => {
          setErrors(e.data?.constraints);
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
      <NavigationBox.NavBar onProducts={false} setBasketListener={null} />
      <Grid
        container
        direction="row"
        spacing="1rem"
        paddingY="5rem"
        alignItems="center"
        justifyItems="center"
        width="auto"
        xs={12}
        sx={{ ml: '0' }}
      >
        {' '}
        <Grid container item xs={12} sx={{ pb: 2 }}>
          <Typography
            variant="h6"
            noWrap
            color="primary.main"
            fontWeight="bold"
            sx={{ fontSize: { sm: 28 }, mr: 'auto' }}
          >
            {'Checkout'}
          </Typography>
          {deliveryOption === 'pickup' ? (
            <Button
              sx={{
                minWidth: 0,
                float: 'right',
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
                {'Save basket'}
              </Typography>
            </Button>
          ) : (
            ''
          )}
        </Grid>
        <Grid container item xs={12} spacing={2} sx={{ pb: 5 }}>
          <Card sx={{ width: '100%', p: 3 }}>
            <Box sx={{ pb: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 'bold' }}
              >
                Your basket
              </Typography>
            </Box>
            <Grid
              container
              direction="row"
              spacing={2}
              alignItems="center"
              justifyItems="center"
            >
              <Grid item xs={1}>
                <AvatarGroup sx={{ float: 'left' }}>
                  {basket?.entries?.map(e => (
                    <Avatar key={e.product.id} src={e.product.image} />
                  ))}
                </AvatarGroup>
              </Grid>
              <Grid item xs={10}>
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
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <Card sx={{ width: '100%', p: 3 }}>
            <Box sx={{ pb: 3 }}>
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: 'bold' }}
              >
                Delivery options
              </Typography>
            </Box>
            <Typography component="div" sx={{ fontSize: '15px' }}>
              Choose an option:
            </Typography>

            <ToggleButtonGroup
              value={deliveryOption}
              exclusive
              onChange={e => {
                const value = (e.target as any).value as DeliveryOption;
                setDeliveryOption(value);
                form.setFieldValue(
                  'deliveryLocation',
                  value === DeliveryOption.PICKUP
                    ? null
                    : basket.deliveryLocation ?? {
                        name: (profile as User).name,
                        surname: (profile as User).surname,
                        address: (profile as User)?.address.address,
                        zipCode: (profile as User)?.address.zipCode,
                        city: (profile as User)?.address.city,
                        province: (profile as User)?.address.province,
                        region: (profile as User)?.address.region,
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
            {form.values?.deliveryLocation != null && (
              <Grid
                container
                display="grid"
                gap={6}
                gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
                sx={{ pt: 3 }}
              >
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
                    error={!!form.errors?.deliveryLocation?.name}
                  >
                    <InputLabel htmlFor="outlined-adornment-address">
                      Name
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-name"
                      name="deliveryLocation.name"
                      value={form.values?.deliveryLocation?.name ?? ''}
                      label="Name"
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.name}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
                    error={!!form.errors?.deliveryLocation?.surname}
                  >
                    <InputLabel htmlFor="outlined-adornment-address">
                      Surname
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-surname"
                      name="deliveryLocation.surname"
                      value={form.values?.deliveryLocation?.surname ?? ''}
                      label="Surname"
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.surname}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
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
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.address}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
                    error={!!form.errors?.deliveryLocation?.zipCode}
                  >
                    <InputLabel htmlFor="outlined-adornment-zipcode">
                      Zip code
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-zipcode"
                      label="Zip code"
                      name="deliveryLocation.zipCode"
                      value={form.values?.deliveryLocation?.zipCode ?? ''}
                      onChange={form.handleChange}
                    />
                  </FormControl>
                  <FormHelperText>
                    {form.errors?.deliveryLocation?.zipCode}
                  </FormHelperText>
                </Grid>
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
                    error={!!form.errors?.deliveryLocation?.city}
                  >
                    <InputLabel htmlFor="outlined-adornment-city">
                      City
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-city"
                      label="City"
                      name="deliveryLocation.city"
                      value={form.values?.deliveryLocation?.city ?? ''}
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.city}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
                    error={!!form.errors?.deliveryLocation?.province}
                  >
                    <InputLabel htmlFor="outlined-adornment-province">
                      Province
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-province"
                      label="Province"
                      name="deliveryLocation.province"
                      value={form.values?.deliveryLocation?.province ?? ''}
                      onChange={form.handleChange}
                    />
                    <FormHelperText>
                      {form.errors?.deliveryLocation?.province}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    disabled={pending}
                    error={!!form.errors?.deliveryLocation?.region}
                  >
                    <InputLabel htmlFor="outlined-adornment-region">
                      Region
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-region"
                      label="Region"
                      name="deliveryLocation.region"
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
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </>
  );
}
