import * as React from 'react';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { DateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  Typography,
  InputLabel,
  FormControl,
  OutlinedInput,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  FormHelperText,
} from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Order, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
export enum DeliveryOption {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

const IOSSwitch = styled((props:any) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" defaultChecked disableRipple {...props}  onChange = {p =>{props.setCheck(p.target.checked)}} />
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

export default function Checkout() {
  const { basket, updateBasket, pending } = useBasket();
  const { profile } = useProfile();
  const [check, setCheck] = useState(true);
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
    onSubmit: (values, { setErrors }) =>
      updateBasket(values).catch(e => {
        setErrors(e.data?.constraints);
      }),
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

  return (
    <>
      <NavigationBox.NavBar onProducts={false} setBasketListener={null} />
      <Grid container direction="row" sx={{ px: 15, py: 8 }}>
        <Grid container item xs={12} spacing={2} sx={{ py: 5 }}>
          <Typography
            variant="h6"
            noWrap
            component="h1"
            color="primary.main"
            fontWeight="bold"
            sx={{ fontSize: { sm: 28 }, mr: 'auto' }}
          >
            {'Checkout'}
          </Typography>
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
                    {(profile as User)?.balance == null
                      ? '0'
                      : (profile as User)?.balance}
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
                <FormControlLabel
                    control={<IOSSwitch sx={{ m: 1 }} setCheck={setCheck}/>}
                    label="Default address"
                />
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
                      disabled = {check}
                      value={(check && form.values?.deliveryLocation?.name) || ''}
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
                      value={(check &&form.values?.deliveryLocation?.surname) || ''}
                      label="Surname"
                      disabled={check}
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
                      value={(check && form.values?.deliveryLocation?.address) || ''}
                      disabled={check}
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
                      value={(check && form.values?.deliveryLocation?.zipCode) || ''}
                      onChange={form.handleChange}
                      disabled={check}
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
                      value={(check && form.values?.deliveryLocation?.city) || ''}
                      onChange={form.handleChange}
                      disabled={check}
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
                      value={(check && form.values?.deliveryLocation?.province) || ''}
                      onChange={form.handleChange}
                      disabled={check}
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
                      value={(check && form.values?.deliveryLocation?.region) || ''}
                      onChange={form.handleChange}
                      disabled={check}
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
                label="Delivery date and time"
                value={form.values?.deliverAt}
                onChange={date => form.setFieldValue('deliverAt', date)}
                renderInput={(params: any) => (
                  <TextField
                    sx={{ mr: 8 }}
                    {...params}
                    name="deliverAt"
                    disabled={pending}
                    error={form.errors?.deliverAt}
                    helperText={form.errors?.deliverAt}
                  />
                )}
              />
            </LocalizationProvider>
          </Card>
          <Button
            sx={{
              minWidth: 0,
              px: { xs: 1, sm: 2 },
              mt: 2,
              float: 'right',
            }}
            variant="contained"
            onClick={() => form.submitForm()}
            startIcon={<CreditCardIcon />}
          >
            <Typography
              sx={{
                textTransform: 'none',
                marginLeft: 1,
              }}
            >
              Save basket
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
