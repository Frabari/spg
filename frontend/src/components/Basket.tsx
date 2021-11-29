import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
  const { upsertEntry, deleteEntry } = useBasket();

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
                <Typography>
                  <IconButton
                    sx={{ p: 0, fontSize: 12 }}
                    onClick={() => deleteEntry(props.product)}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 14 }} /> Delete
                  </IconButton>
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Typography gutterBottom fontSize="17px" component="div">
                  € {props.price * props.quantity}
                </Typography>
                <Typography
                  gutterBottom
                  fontSize="10px"
                  component="div"
                  sx={{ marginBottom: 0 }}
                >
                  (€ {props.price} /{props.product.unitOfMeasure})
                </Typography>
              </CardContent>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex' }}>
              <CardActions>
                <IconButton
                  disabled={props.quantity === 1}
                  onClick={() => upsertEntry(props.product, -1)}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2" display="inline">
                  {props.quantity}
                </Typography>
                <IconButton
                  disabled={props.product.available === 0}
                  onClick={() => upsertEntry(props.product, 1)}
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
        {basket?.entries?.map(e => (
          <ProductCard
            key={e.product.id}
            name={e.product.name}
            image={e.product.image}
            price={e.product.price}
            description={e.product.description}
            product={e.product}
            quantity={e.quantity}
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
          Total € {basket.total}
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
