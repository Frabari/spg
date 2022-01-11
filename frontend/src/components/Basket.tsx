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
import { Product } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useUpdateBasket } from '../hooks/useUpdateBasket';

const ProductCard = (props: any) => {
  const { upsertEntry, deleteEntry } = useUpdateBasket();

  const handleDeleteEntry = (product: Product) => {
    props.setShowBasket(false);
    deleteEntry(product);
  };

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
                    onClick={() => handleDeleteEntry(props.product)}
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
                      ({props.product.baseUnit})
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
                      sx={{ mr: '8px' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography
                      variant="body2"
                      display="inline"
                      alignSelf="center"
                      textAlign="center"
                    >
                      {props.quantity}
                    </Typography>
                    <IconButton
                      disabled={props.product.available === 0}
                      onClick={() => upsertEntry(props.product, 1)}
                      sx={{ ml: 0 }}
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
};

export const Basket = ({
  setShowBasket,
}: {
  filter?: string;
  search?: string;
  setShowBasket?: any;
}) => {
  const { data: basket } = useBasket();

  return (
    <Box position="relative" sx={{ flexGrow: 1 }}>
      {basket?.entries?.length !== 0 ? (
        <Box maxHeight="80vh" sx={{ overflowY: 'auto' }}>
          <Grid container sx={{ p: 2 }} direction="column" gap={2}>
            {basket?.insufficientBalance && (
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
                  quantity={e.quantity}
                  setShowBasket={setShowBasket}
                />
              ))}
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              background: 'white',
              position: 'absolute',
              left: 0,
              bottom: 0,
              right: 0,
            }}
          >
            <Grid item xs={6}>
              <Box
                sx={{
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
                  € {basket?.total}
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
        </Box>
      ) : (
        <Grid container direction="column" p={2}>
          <Box
            component="img"
            sx={{
              maxWidth: { xs: '100%', sm: 350, md: 350, lg: 350 },
              filter: 'grayscale(100%)',
            }}
            src="https://cdn.dribbble.com/users/44167/screenshots/4199208/media/e2f1188c18430f9ab0af074ae7a88ee8.png"
          />
          <Typography
            textAlign="center"
            variant="h6"
            fontSize="24px"
            marginTop="0px"
          >
            Your basket is empty
          </Typography>
          <Typography textAlign="center" variant="h6" fontSize="18px">
            Add some products
          </Typography>
        </Grid>
      )}
    </Box>
  );
};
