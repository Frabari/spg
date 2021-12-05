import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
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
} from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Order } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useUser } from '../hooks/useUser';
import NavigationBox from './Navigation';

export default function Checkout() {
  const navigate = useNavigate();
  const { basket, updateBasket } = useBasket();
  const { user } = useUser();
  const [delivery, setDelivery] = useState<string | null>('at_store');
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<Date | null>(new Date());
  const [dto, setDto] = useState<Partial<Order>>({});

  const handleDelivery = (
    event: React.MouseEvent<HTMLElement>,
    newDelivery: string | null,
  ) => {
    setDelivery(newDelivery);
  };

  const handleAddressChange = (key: string, value: any) => {
    setDto(_dto => ({
      ..._dto,
      deliveryLocation: {
        ...(_dto?.deliveryLocation ?? {}),
        [key]: value,
      },
    }));
  };

  const saveBasket = () => {
    updateBasket(dto)
      .then(() => {
        navigate(`/products`);
      })
      .catch(() => {
        // noop
      });
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
          {delivery === 'at_store' ? (
            <Button
              sx={{
                minWidth: 0,
                float: 'right',
              }}
              variant="contained"
              onClick={saveBasket}
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
                {'Your basket'}
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
                  {'Your balance €'}
                  <Typography
                    fontWeight="bold"
                    align="right"
                    gutterBottom
                    component="div"
                    display="inline"
                    color="#757575"
                  >
                    {user?.balance == null ? '0' : user?.balance}
                  </Typography>
                </Typography>
                <Typography
                  align="right"
                  gutterBottom
                  variant="h5"
                  component="div"
                >
                  {'Total €'}
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
                {'Delivery options'}
              </Typography>
            </Box>
            <Typography component="div" sx={{ fontSize: '15px' }}>
              {'Choose an option: '}
            </Typography>

            <ToggleButtonGroup
              value={delivery}
              exclusive
              onChange={handleDelivery}
              aria-label="delivery"
              sx={{ mt: 2, borderRadius: '16px' }}
            >
              <ToggleButton value="at_store">{"I'll pick it up"}</ToggleButton>
              <ToggleButton value="at_home">{'Deliver it'}</ToggleButton>
            </ToggleButtonGroup>
            {delivery === 'at_home' ? (
              <Grid
                container
                display="grid"
                gap={6}
                gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
                sx={{ pt: 3 }}
              >
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-address">
                      {'Name'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-name"
                      onChange={e =>
                        handleAddressChange('name', e.target.value)
                      }
                      label="Name"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-address">
                      {'Surname'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-surname"
                      onChange={e =>
                        handleAddressChange('surname', e.target.value)
                      }
                      label="Surname"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-address">
                      {'Address'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-address"
                      onChange={e =>
                        handleAddressChange('address', e.target.value)
                      }
                      label="Address"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-zipcode">
                      {'Zip code'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-zipcode"
                      onChange={e =>
                        handleAddressChange('zipCode', e.target.value)
                      }
                      label="Zip code"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-city">
                      {'City'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-city"
                      onChange={e =>
                        handleAddressChange('city', e.target.value)
                      }
                      label="City"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-province">
                      {'Province'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-province"
                      onChange={e =>
                        handleAddressChange('privince', e.target.value)
                      }
                      label="Province"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-region">
                      {'Region'}
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-region"
                      onChange={e =>
                        handleAddressChange('region', e.target.value)
                      }
                      label="Region"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            ) : (
              ''
            )}
            <Typography component="div" sx={{ py: 3, fontSize: '15px' }}>
              {'Delivery date: '}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Choose a date"
                value={date}
                minDate={new Date('2021-01-01')}
                maxDate={new Date('2025-12-31')}
                onChange={(newDate: Date) => {
                  setDate(newDate);
                }}
                renderInput={(params: any) => (
                  <TextField sx={{ mr: 8 }} {...params} />
                )}
              />
              <TimePicker
                label="Choose a time"
                value={time}
                onChange={(newTime: any) => {
                  setTime(newTime);
                }}
                renderInput={params => (
                  <TextField sx={{ mr: 'auto' }} {...params} />
                )}
              />
            </LocalizationProvider>
          </Card>
          {delivery === 'at_home' ? (
            <Button
              sx={{
                minWidth: 0,
                mt: 2,
                float: 'right',
              }}
              variant="contained"
              onClick={saveBasket}
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
