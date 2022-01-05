import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Product, Role, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
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
      toast.error(
        `You can add products to the basket only from Saturday 9am to Sunday 23pm`,
      );
    } else {
      if (onSelect) {
        onSelect(product);
      } else {
        upsertEntry(product, 1).then(o => {
          setBasketListener(true);
          toast.success(`${product.name} successfully added!`);
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
  const [date] = useVirtualClock();

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

  const [farmers, setFarmers] = useState(null);
  const { users } = useUsers();

  useEffect(() => {
    if (users) {
      setFarmers(users.filter(u => u.role === Role.FARMER));
    }
  }, [users]);

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

  const [open, setOpen] = useState(true);

  return (
    <>
      {farmers?.map((f: any) => (
        <>
          <Grid
            borderRadius="16px"
            spacing="2rem"
            padding="1rem"
            width="auto"
            marginBottom="1rem"
            marginX="1rem"
            sx={{ backgroundColor: '#fafafa' }}
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
                  {f.name + ' ' + f.surname}
                </Typography>
                <Avatar src={f.avatar} sx={{ boxShadow: 2, right: 0, ml: 1 }} />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography
                  align="left"
                  fontWeight="bold"
                  gutterBottom
                  variant="h6"
                  component="div"
                  fontSize="1.5rem"
                >
                  {'Cascina Perosa'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Typography
                  align="left"
                  gutterBottom
                  component="div"
                  fontSize="9"
                >
                  {'Via Zio Pera 1, Borgoratto, Imperia '}
                </Typography>
              </Grid>
            </Grid>

            <Grid
              container
              display="grid"
              gap={2.5}
              gridTemplateColumns="repeat(auto-fill, minmax(10rem, 1fr))"
              padding="1rem"
            >
              {products
                ?.filter(p => p.farmer.id === f.id)
                ?.filter(p => !filter || p.category.slug === filter)
                ?.filter(
                  p =>
                    !search ||
                    p.name.toLowerCase().includes(search.toLowerCase()),
                )
                ?.filter(
                  p =>
                    !farmer ||
                    p.farmer.email.toLowerCase() === farmer.email.toLowerCase(),
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
                          setBasketListener={setBasketListener}
                        />
                      </Grid>
                    ) : (
                      <Grid item>
                        <ProductCard
                          key={p.id}
                          product={p}
                          onSelect={onSelect}
                          setBalanceWarning={setBalanceWarning}
                          setBasketListener={setBasketListener}
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
