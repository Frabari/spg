import { useState } from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
import { useBasket } from '../hooks/useBasket';

function ProductCard(props: any) {
  const [counter, setCounter] = useState(0);

  return (
    <Grid item xs={12}>
      <Card sx={{ width: '500px' }}>
        <Grid
          container
          direction="row"
          justifyItems="center"
          alignItems="center"
          spacing="1rem"
        >
          <Grid item xs={3}>
            <CardMedia
              component="img"
              sx={{ width: 100 }}
              image={props.image}
            />
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography gutterBottom fontSize="17px" component="div">
                  {props.name}
                </Typography>
                <Typography fontSize="14px" color="text.secondary">
                  quantità
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent>
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
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex' }}>
              <CardActions>
                <IconButton
                  disabled={counter === 0}
                  onClick={() => setCounter(counter - 1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" display="inline">
                  {counter}
                </Typography>
                <IconButton
                  disabled={counter === props.product?.available}
                  onClick={() => setCounter(counter + 1)}
                  sx={{ pl: 0 }}
                >
                  <AddIcon />
                </IconButton>
              </CardActions>
            </Box>
          </Grid>
        </Grid>
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
  const { basket } = useBasket();

  return (
    <>
      <Grid
        container
        direction="column"
        spacing="1rem"
        padding="0.5rem"
        alignItems="center"
        justifyItems="center"
        width="auto"
      >
        {basket.entries
          ?.filter(e => !filter || e.product.category.slug === filter)
          ?.filter(
            e =>
              !search ||
              e.product.name.toLowerCase().includes(search.toLowerCase()),
          )
          .map(e => (
            <ProductCard
              key={e.product.id}
              name={e.product.name.split(' ')[2]}
              image={e.product.image}
              price={e.product.price}
              description={e.product.description}
              product={e}
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
