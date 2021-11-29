import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Alert,
  AlertTitle,
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
    <Grid item xs={12} sx={{ width: '100%' }}>
      <Card sx={{ width: '100%' }}>
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
                <Typography gutterBottom fontSize="16px" component="div">
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
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              justifyItems="center"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Box sx={{ flexDirection: 'column' }}>
                  <CardContent sx={{ pb: '0 !important' }}>
                    <Typography
                      gutterBottom
                      fontSize="16px"
                      component="div"
                      textAlign="center"
                    >
                      € {props.price * props.quantity}
                    </Typography>
                    <Typography
                      gutterBottom
                      fontSize="12px"
                      component="div"
                      textAlign="center"
                    >
                      (€ {props.price} /{props.product.unitOfMeasure})
                    </Typography>
                  </CardContent>
                </Box>
              </Grid>
              <Grid item xs={12}>
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
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}

export default function Basket({
  filter,
  search,
  balanceWarning,
}: {
  filter?: string;
  search?: string;
  balanceWarning?: boolean;
}) {
  const { basket } = useBasket();

  return (
    <>
      <Grid
        container
        direction="column"
        spacing="1rem"
        paddingY="0.5rem"
        paddingX="1rem"
        alignItems="center"
        justifyItems="center"
        width="auto"
      >
        {balanceWarning && (
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            Insufficient balance — <strong>top it up!</strong>
          </Alert>
        )}
        {basket?.entries
          ?.sort((a, b) => a.product.price - b.product.price)
          ?.map(e => (
            <ProductCard
              key={e.product.id}
              name={e.product.name}
              image={e.product.image}
              price={e.product.price}
              description={e.product.description}
              product={e.product}
              balanceWarning={balanceWarning}
              quantity={e.quantity}
            />
          ))}
      </Grid>
      <Grid container direction="row" alignItems="center" spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{
              float: 'left',
              alignItems: 'center',
              justifyItems: 'center',
              m: 3,
              mr: 0,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              fontSize="24px"
              component="div"
              display="inline"
              mb={0}
            >
              Total
            </Typography>
            <Typography
              gutterBottom
              fontSize="24px"
              component="div"
              fontWeight="bold"
              display="inline"
              mb={0}
              ml={2}
            >
              € {basket.total}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Button
            component={Link}
            to={'/checkout'}
            variant="contained"
            sx={{ m: 3, ml: 0, float: 'right' }}
            endIcon={<ArrowForwardIcon />}
          >
            Check out
          </Button>
        </Grid>
      </Grid>
    </>
  );
}