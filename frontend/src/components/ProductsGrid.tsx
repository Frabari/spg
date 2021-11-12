import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import AddIcon from '@mui/icons-material/Add';

function ProductCard(props: { name: string; image: string; price: number }) {
  return (
    <Grid item lg={2} md={4} xs={12}>
      <Card sx={{ height: "400" }}>
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
            € {props.price}/kg
          </Typography>
        </CardContent>
        <CardActions>
          <Box marginLeft="auto" padding="0.5rem">
            <IconButton>
              <AddIcon/>
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default function ProductsGrid(props: any) {
  const products = useProducts();

  return (
    <>
      <Grid
        container
        direction="row"
        spacing="2rem"
        padding="2rem"
        alignItems="center"
        justifyItems="center"
      >
        {products?.map(p => (
          <ProductCard name={p.name.split(" ")[2]} image={p.image} price={p.price} />
        ))}
      </Grid>
    </>
  );
}
