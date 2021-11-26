import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import ProductInfo from '../pages/ProductInfo';

function ProductCard(props: any) {
  const [open, setOpen] = useState(false);
  const [counter, setCounter] = useState(0);

  const handleInfo = () => {
    if (!props.onSelect) {
      setOpen(true);
    }
  };

  const handleSelect = () => {
    if (props.onSelect) {
      props.onSelect(props.product);
    }
  };

  return (
    <Grid item lg={12} md={12} sm={12} xs={12}>
      <ProductInfo open={open} setOpen={setOpen} {...props} />
      <Card sx={{ display: 'flex' }}>
        <CardMedia
          component="img"
          sx={{ width: 100 }}
          image={props.image}
          onClick={handleInfo}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent onClick={handleInfo}>
            <Typography gutterBottom fontSize="17px" component="div">
              {props.name}
            </Typography>
            <Typography fontSize="14px" color="text.secondary">
              quantità
            </Typography>
          </CardContent>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent onClick={handleInfo}>
            <Typography
              gutterBottom
              fontSize="17px"
              component="div"
              align="center"
            >
              € {props.price}
            </Typography>
          </CardContent>
        </Box>
        <Box sx={{ display: 'flex', pl: 20 }}>
          <CardActions>
            <IconButton
              disabled={counter === 0}
              onClick={() => setCounter(counter - 1)}
            >
              -
            </IconButton>
            <Typography variant="body2" display="inline">
              {counter}
            </Typography>
            <IconButton
              disabled={counter === props.product?.available}
              onClick={() => setCounter(counter + 1)}
            >
              +
            </IconButton>
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
}

export default function Basket({
  filter,
  search,
}: {
  filter?: string;
  search?: string;
}) {
  const { products } = useProducts();

  return (
    <>
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
          .map(p => (
            <ProductCard
              key={p.id}
              name={p.name.split(' ')[2]}
              image={p.image}
              price={p.price}
              description={p.description}
              product={p}
            />
          ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          right: 10,
          p: 3,
        }}
      >
        <Typography
          gutterBottom
          fontSize="17px"
          component="div"
          sx={{ width: '100%', float: 'right' }}
        >
          Total € ammontare
        </Typography>
        <Button
          component={Link}
          to={'/checkout'}
          variant="contained"
          sx={{ px: 3 }}
        >
          Check out
        </Button>
      </Box>
    </>
  );
}
