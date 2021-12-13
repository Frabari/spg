import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Product, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useProducts } from '../hooks/useProducts';

const { DateTime } = require('luxon');

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
  const navigate = useNavigate();

  if (setBalanceWarning) setBalanceWarning(basket?.insufficientBalance);

  const handleInfo = () => {
    if (!onSelect) {
      navigate(`/products/${product.id}`, {
        state: { product: product },
      });
    }
  };

  const handleSelect = (product: Product) => {
    if (
      DateTime.now() >= moment().day('saturday').hour(9) ||
      DateTime.now() <= moment().day('monday').hour(23).minutes(0)
    ) {
      if (onSelect) {
        onSelect(product);
      } else {
        upsertEntry(product, 1).then(o => {
          setBasketListener(true);
          toast.success(`${product.name} successfully added!`);
        });
      }
    } else {
      toast.error(
        `You can add products to the basket only from Saturday 9am to Sunday 23pm`,
      );
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
        <CardActions>
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
  farmer?: User;
  filter?: string;
  search?: string;
  onSelect: (product: Product) => void;
  handleDelete?: () => void;
  setBalanceWarning?: (bol: boolean) => void;
  basketListener?: boolean;
  setBasketListener?: (bol: boolean) => void;
}) {
  const { products, loadProducts } = useProducts();

  const [sortOption, setSortOption] = useState('');
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

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} sm={11}>
          {farmer && (
            <Chip
              sx={{ m: 2 }}
              onDelete={handleDelete}
              variant="outlined"
              label={`Product by ${farmer.name} ${farmer.surname}`}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={1} display={onSelect ? 'none' : 'block'}>
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
              !farmer ||
              p.farmer.email.toLowerCase() === farmer.email.toLowerCase(),
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
