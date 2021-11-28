import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
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
  Typography,
} from '@mui/material';
import { Product, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useProducts } from '../hooks/useProducts';

function ProductCard(props: any) {
  const { basket, upsertEntry } = useBasket();
  const navigate = useNavigate();

  const handleInfo = () => {
    if (!props.onSelect) {
      navigate(`/products/${props.product.id}`, {
        state: { product: props.product },
      });
    }
  };

  const handleSelect = (product: Product) => {
    if (props.onSelect) {
      props.onSelect(product);
    } else {
      upsertEntry(product, 1).then(o => {
        toast.success(`${product.name} succesfully added!`);
      });
    }
  };

  return (
    <Grid item lg={3} md={4} sm={6} xs={12}>
      <Card sx={{ height: '400' }}>
        <CardMedia
          component="img"
          height="200"
          width="200"
          image={props.image}
          onClick={handleInfo}
          sx={{ cursor: 'pointer' }}
        />
        <CardContent onClick={handleInfo} sx={{ cursor: 'pointer' }}>
          <Typography gutterBottom variant="h5" component="div" align="center">
            {props.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            {props.product?.available} kg available
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            € {props.price}/{props.product.unitOfMeasure}
          </Typography>
        </CardContent>
        <CardActions>
          <Box marginLeft="auto" padding="0.5rem">
            <IconButton onClick={() => handleSelect(props.product)}>
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
}: {
  farmer?: User;
  filter?: string;
  search?: string;
  onSelect: (product: Product) => void;
  handleDelete?: () => void;
}) {
  const { products } = useProducts();

  return (
    <>
      {farmer && (
        <Chip
          sx={{ marginLeft: 2 }}
          onDelete={handleDelete}
          variant="outlined"
          label={`Product by ${farmer.name} ${farmer.surname}`}
        />
      )}
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
          .map(p => (
            <ProductCard
              key={p.id}
              name={p.name}
              image={p.image}
              price={p.price}
              description={p.description}
              product={p}
              onSelect={onSelect}
            />
          ))}
      </Grid>
    </>
  );
}
