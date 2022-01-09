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
  Paper,
  Typography,
} from '@mui/material';
import { NotificationType, Product } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useDate } from '../hooks/useDate';
import { useFarmers } from '../hooks/useFarmers';
import { useNotifications } from '../hooks/useNotifications';
import { useProducts } from '../hooks/useProducts';
import { useProfile } from '../hooks/useProfile';
import { useUpdateBasket } from '../hooks/useUpdateBasket';

function ProductCard({
  product,
  setBalanceWarning,
  onSelect,
}: {
  product?: Product;
  setBalanceWarning?: (bol: boolean) => void;
  onSelect: (product: Product) => void;
}) {
  const { data: basket } = useBasket();
  const { upsertEntry } = useUpdateBasket();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const { data: date } = useDate();
  const vertical = 'bottom',
    horizontal = 'center';
  const { enqueueNotification } = useNotifications();

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
      enqueueNotification({
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
        upsertEntry(product, 1).then(() => {
          enqueueNotification({
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
            € {product.price}/{product.baseUnit}
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
  onSelect,
}: {
  onSelect: (product: Product) => void;
}) {
  const { data: products } = useProducts();
  const { data: date } = useDate();

  const from = date.set({
    weekday: 6,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const to = from.plus({ hour: 38 });

  const { data: farmers } = useFarmers();

  return (
    <>
      {farmers
        ?.filter(f => f.products.filter(p => p.available > 0).length > 0)
        ?.map((f: any) => (
          <>
            <Grid
              borderRadius="16px"
              spacing="2rem"
              margin="1rem"
              width="auto"
              sx={{ backgroundColor: '#fafafa' }}
            >
              <Grid
                container
                direction="row"
                margin="0"
                width="100%"
                spacing={2}
                sx={{
                  backgroundImage: `url(${f.companyImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100%',
                  backgroundPositionY: '50%',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }}
              >
                <Paper
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    width: '100%',
                    padding: '2rem',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px',
                  }}
                >
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
                      color="white"
                      alignSelf="center"
                      justifySelf="center"
                      marginBottom={0}
                    >
                      {f.name + ' ' + f.surname}
                    </Typography>
                    <Avatar
                      src={f.avatar}
                      sx={{ boxShadow: 2, right: 0, ml: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      align="left"
                      fontWeight="bold"
                      gutterBottom
                      variant="h6"
                      component="div"
                      fontSize="1.5rem"
                      color="white"
                    >
                      {f?.companyName}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <Typography
                      align="left"
                      gutterBottom
                      component="div"
                      fontSize="9"
                      color="white"
                    >
                      {f?.address?.address}, {f?.address?.city},{' '}
                      {f?.address?.province}
                    </Typography>
                  </Grid>
                </Paper>
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
                  ?.filter(p => p.available > 0)
                  .map(p => (
                    <>
                      {date >= from && date <= to ? (
                        <Grid item>
                          <ProductCard
                            key={p.id}
                            product={p}
                            onSelect={onSelect}
                          />
                        </Grid>
                      ) : (
                        <Grid item>
                          <ProductCard
                            key={p.id}
                            product={p}
                            onSelect={onSelect}
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
