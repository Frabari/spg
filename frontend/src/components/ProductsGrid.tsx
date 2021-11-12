import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { useProducts } from '../hooks/useProducts';

function ProductCard(props: { name: string; image: string; price: number }) {
  return (
    <Grid item>
      <Card sx={{ width: '350', height: 'fit-content' }}>
        <CardMedia
          component="img"
          height="200"
          width="200"
          image={props.image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.price}
          </Typography>
        </CardContent>
        <CardActions>
          <Box marginX="auto" padding="0.5rem">
            <Button size="small">Add to cart</Button>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function ProductsGrid() {
  const { products } = useProducts();

  return (
    <Grid
      container
      direction="row"
      spacing="2rem"
      padding="2rem"
      alignItems="center"
      justifyItems="center"
      marginX="auto"
    >
      {products?.map(p => (
        <ProductCard name={p.name} image={p.image} price={p.price} />
      ))}
    </Grid>
  );
}
