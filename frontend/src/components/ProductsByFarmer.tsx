import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { NotificationType, Product, Role, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useDate } from '../hooks/useDate';
import { useNotifications } from '../hooks/useNotifications';
import { useProducts } from '../hooks/useProducts';
import { useProfile } from '../hooks/useProfile';
import { useUpdateBasket } from '../hooks/useUpdateBasket';
import { useUsers } from '../hooks/useUsers';

function ProductCard({
  product,
  setBalanceWarning,
  onSelect,
}: {
  product?: Product;
  setBalanceWarning?: (bol: boolean) => void;
  onSelect: (product: Product) => void;
}) {
  const { data: basket } = useBasket();
  const { upsertEntry } = useUpdateBasket();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const { data: date } = useDate();
  const vertical = 'bottom',
    horizontal = 'center';
  const { enqueueNotification } = useNotifications();

  if (setBalanceWarning) setBalanceWarning(basket?.insufficientBalance);

  const handleInfo = () => {
    if (!onSelect) {
      navigate(`/products/${product.id}`, {
        state: { product: product },
      });
    }
  };

  const from = date.set({
    weekday: 6,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const to = from.plus({ hour: 38 });

  const handleSelect = (product: Product) => {
    if (date < from || date > to) {
      enqueueNotification({
        id: 0,
        type: NotificationType.ERROR,
        title:
          'You can add products to the basket only from Saturday 9am to Sunday 23pm',
        message: '',
        createdAt: new Date(),
      });
    } else {
      if (onSelect) {
        onSelect(product);
      } else {
        upsertEntry(product, 1).then(o => {
          enqueueNotification({
            id: 0,
            type: NotificationType.SUCCESS,
            title: product.name + ' successfully added!',
            message: '',
            createdAt: new Date(),
          });
        });
      }
    }
    if (setBalanceWarning) setBalanceWarning(basket.insufficientBalance);
  };

  return (
    <>
      <Card sx={{ height: '100%' }}>
        <CardMedia
          component="img"
          height="175px"
          image={product.image}
          onClick={handleInfo}
          sx={!onSelect ? { cursor: 'pointer' } : {}}
        />
        <CardContent
          sx={
            !onSelect
              ? { cursor: 'pointer', height: '120px' }
              : { height: '120px' }
          }
          onClick={handleInfo}
        >
          <Typography gutterBottom variant="h5" component="div" align="center">
            {product.name}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            my={1}
          >
            {product?.available} / units
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            fontWeight="bold"
          >
            € {product.price}/{product?.baseUnit}
          </Typography>
        </CardContent>
        {date >= from && date <= to ? (
          <CardActions sx={{ display: !profile && 'none' }}>
            <Box marginLeft="auto" padding="0.5rem">
              <IconButton onClick={() => handleSelect(product)}>
                <AddIcon />
              </IconButton>
            </Box>
          </CardActions>
        ) : (
          ''
        )}
      </Card>
    </>
  );
}

export default function ProductsByFarmer({
  farmer,
  filter,
  onSelect,
  search,
  handleDelete,
  setSearchParams,
  setBalanceWarning,
}: {
  farmer?: string;
  filter?: string;
  search?: string;
  onSelect: (product: Product) => void;
  handleDelete?: () => void;
  setSearchParams?: (params: any) => void;
  setBalanceWarning?: (bol: boolean) => void;
}) {
  const { data: products } = useProducts();
  const { data: date } = useDate();

  const [sortOption, setSortOption] = useState('');
  const sort = [
    'Highest price',
    'Lowest price',
    'Ascending name',
    'Descending name',
  ];

  const from = date.set({
    weekday: 6,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const to = from.plus({ hour: 38 });

  const handleChange = (s: string) => {
    setSortOption(s);
  };

  const sortProducts = (a: Product, b: Product) => {
    switch (sortOption) {
      case 'Lowest price':
        return a.price - b.price;
      case 'Highest price':
        return b.price - a.price;
      case 'Ascending name':
        if (a.name < b.name) return -1;
        else return 1;
      case 'Descending name':
        if (b.name < a.name) return -1;
        else return 1;
    }
  };

  const [open, setOpen] = useState(true);

  const [farmers, setFarmers] = useState(null);
  const { data: users } = useUsers();

  useEffect(() => {
    if (users) {
      setFarmers(users.filter(u => u.role === Role.FARMER));
    }
  }, [users]);

  return (
    <>
      <Grid container direction="row">
        {date < from || date > to ? (
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Collapse in={open}>
              <Alert
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                {' Products can be purchased from '}
                {'Saturday'} {from.day}
                {' (9:00 am)'}
                {' to '}
                {'Sunday'} {to.day}
                {' (11:00 pm)'}
              </Alert>
            </Collapse>
          </Stack>
        ) : (
          ''
        )}
        <Grid item xs={3} sx={{ ml: 'auto' }}>
          <Autocomplete
            multiple
            id="tags-outlined"
            value={users.filter(
              u => farmer && farmer.split('-').indexOf(String(u.id)) >= 0,
            )}
            options={users.filter(u => u.role === Role.FARMER)}
            getOptionLabel={(option: User) =>
              option.name + ' ' + option.surname
            }
            filterSelectedOptions
            onChange={(event, newValue) => {
              if (filter !== '') {
                setSearchParams({
                  farmer: newValue
                    .map(u => {
                      return String((u as User).id);
                    })
                    .join('-')
                    .toString(),
                  category: filter,
                });
              } else {
                setSearchParams({
                  farmer: newValue
                    .map(u => {
                      return String((u as User).id);
                    })
                    .join('-')
                    .toString(),
                });
              }
            }}
            renderInput={params => (
              <TextField {...params} label="Filter farmers" size="small" />
            )}
          />
        </Grid>
        <Grid item display={onSelect ? 'none' : 'block'}>
          <TextField
            id="outlined-select-sort"
            select
            value={sortOption}
            size="small"
            label="Sort by"
            sx={{
              width: '200px',
              float: { xs: 'left', sm: 'right' },
              mr: 2,
              ml: 2,
              mt: { xs: 2, sm: 0 },
            }}
            onChange={e => handleChange(e.target.value)}
          >
            {sort.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      {farmers
        ?.filter((f: User) => {
          return (
            farmer === null ||
            farmer === '' ||
            farmer.split('-').includes(String(f.id))
          );
        })
        .map((f: User) => (
          <>
            <Grid
              borderRadius="16px"
              spacing="2rem"
              padding="1rem"
              width="auto"
              marginBottom="1rem"
              sx={{ backgroundColor: 'white' }}
            >
              <Grid container direction="row" spacing={2} padding="2rem">
                <Grid
                  container
                  direction="row"
                  justifyContent="end"
                  alignContent="center"
                  xs={12}
                  sm={12}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    display="inline"
                    fontSize="1rem"
                  >
                    {f?.name + ' ' + f?.surname}
                  </Typography>
                  <Avatar
                    src={f?.avatar}
                    sx={{ boxShadow: 2, right: 0, ml: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography
                    align="left"
                    fontWeight="bold"
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontSize="2rem"
                  >
                    {f?.companyName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Typography
                    align="left"
                    gutterBottom
                    component="div"
                    fontSize="10"
                  >
                    {f?.address?.address}, {f?.address?.city},{' '}
                    {f?.address?.province}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                display="grid"
                gap={2.5}
                gridTemplateColumns="repeat(auto-fill, minmax(16rem, 1fr))"
                padding="1rem"
              >
                {products
                  ?.filter(p => p.farmer?.id === f?.id)
                  ?.filter(p => filter === '' || p.category.slug === filter)
                  ?.filter(
                    p =>
                      !search ||
                      p.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  ?.filter(
                    p =>
                      !farmer ||
                      (farmer &&
                        farmer.split('-').indexOf(String(p.farmer.id)) >= 0),
                  )
                  ?.filter(p => p.available > 0)
                  ?.sort((a, b) => sortProducts(a, b))
                  .map(p => (
                    <>
                      {date >= from && date <= to ? (
                        <Grid item>
                          <ProductCard
                            key={p.id}
                            product={p}
                            onSelect={onSelect}
                            setBalanceWarning={setBalanceWarning}
                          />
                        </Grid>
                      ) : (
                        <Grid item>
                          <ProductCard
                            key={p.id}
                            product={p}
                            onSelect={onSelect}
                            setBalanceWarning={setBalanceWarning}
                          />
                        </Grid>
                      )}
                    </>
                  ))}
              </Grid>
            </Grid>
          </>
        ))}
    </>
  );
}
