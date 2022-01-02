import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Product, Role, NotificationType } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useNotifications } from '../hooks/useNotifications';
import { useProducts } from '../hooks/useProducts';
import { useProfile } from '../hooks/useProfile';
import { useUsers } from '../hooks/useUsers';
import { useVirtualClock } from '../hooks/useVirtualClock';

function ProductCard({
  product,
  setBalanceWarning,
  setBasketListener,
  onSelect,
}: {
  product?: Product;
  setBalanceWarning?: (bol: boolean) => void;
  setBasketListener?: (bol: boolean) => void;
  onSelect: (product: Product) => void;
}) {
  const { basket, upsertEntry } = useBasket();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [date] = useVirtualClock();
  const vertical = 'bottom',
    horizontal = 'center';
  const { enqueueNotifications } = useNotifications();

  if (setBalanceWarning) setBalanceWarning(basket?.insufficientBalance);

  const handleInfo = () => {
    if (!onSelect) {
      navigate(`/products/${product.id}`, {
        state: { product: product },
      });
    }
  };

  const handleSelect = (product: Product) => {
    const from = date.set({
      weekday: 6,
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    const to = from.plus({ hour: 38 });

    if (date < from || date > to) {
      enqueueNotifications({
        id: 0,
        type: NotificationType.ERROR,
        title:
          'You can add products to the basket only from Saturday 9am to Sunday 23pm',
        message:
          'You can add products to the basket only from Saturday 9am to Sunday 23pm',
        createdAt: new Date(),
      });
    } else {
      if (onSelect) {
        onSelect(product);
      } else {
        upsertEntry(product, 1).then(o => {
          setBasketListener(true);

          enqueueNotifications({
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
    <Grid item lg={3} md={4} sm={6} xs={12} height={'425px'}>
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
            {product?.available} units available
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            fontWeight="bold"
          >
            € {product.price}/unit
          </Typography>
        </CardContent>
        <CardActions sx={{ display: !profile && 'none' }}>
          <Box marginLeft="auto" padding="0.5rem">
            <IconButton onClick={() => handleSelect(product)}>
              <AddIcon />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function ProductsGrid({
  farmer,
  filter,
  onSelect,
  search,
  handleDelete,
  setBalanceWarning,
  basketListener,
  setBasketListener,
}: {
  farmer?: string;
  filter?: string;
  search?: string;
  onSelect: (product: Product) => void;
  handleDelete?: () => void;
  setBalanceWarning?: (bol: boolean) => void;
  basketListener?: boolean;
  setBasketListener?: (bol: boolean) => void;
}) {
  const { products, loadProducts } = useProducts();
  const { users } = useUsers();
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const firstUpdate = useRef(true);
  const navigate = useNavigate();
  const sort = [
    'Highest price',
    'Lowest price',
    'Ascending name',
    'Descending name',
  ];

  useEffect(() => {
    if (basketListener) {
      loadProducts();
      setBasketListener(false);
    }
  }, [basketListener]);

  useEffect(() => {
    console.log(count);
    if (count === 0) {
      if (farmer)
        setFilters(
          users.filter(u => farmer.split(',').indexOf(u.id.toString()) >= 0),
        );
      setCount(1);
    }
    if (count === 2) {
      if (filters.length === 0)
        navigate(`/products${filter ? `?category=${filter}` : ''}`);
      else {
        let str = '';
        for (const fa of filters) str += fa.id + ',';
        navigate(
          `/products?farmer=${str}${filter ? `&category=${filter}` : ''}`,
        );
      }
    }
  }, [filters]);

  const handleChange = (s: string) => {
    setSortOption(s);
  };

  const handleFarmerChange = () => {
    if (filters.length === 0)
      navigate(`/products${filter ? `?category=${filter}` : ''}`);
    else {
      let str = '';
      for (const fa of filters) str += fa.id + ',';
      navigate(`/products?farmer=${str}${filter ? `&category=${filter}` : ''}`);
    }
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

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Grid item xs={3} sx={{ ml: 'auto' }}>
          <Autocomplete
            multiple
            id="tags-outlined"
            value={filters}
            options={users.filter(u => u.role === Role.FARMER)}
            getOptionLabel={option => option.name + ' ' + option.surname}
            filterSelectedOptions
            onChange={(event, newValue) => {
              setCount(2);
              setFilters(newValue);
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
      <Grid
        container
        direction="row"
        spacing="2rem"
        padding="1rem"
        alignItems="center"
        justifyItems="center"
        width="auto"
      >
        {products
          ?.filter(p => !filter || p.category.slug === filter)
          ?.filter(
            p => !search || p.name.toLowerCase().includes(search.toLowerCase()),
          )
          ?.filter(
            p =>
              !farmer || farmer.split(',').indexOf(p.farmer.id.toString()) >= 0,
          )
          ?.filter(p => p.available > 0)
          ?.sort((a, b) => sortProducts(a, b))
          .map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelect}
              setBalanceWarning={setBalanceWarning}
              setBasketListener={setBasketListener}
            />
          ))}
      </Grid>
    </>
  );
}
