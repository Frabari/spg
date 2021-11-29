import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  TextField,
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
        window.location.reload();
        toast.success(`${product.name} succesfully added!`);
      });
    }
  };

  return (
    <Grid item lg={3} md={4} sm={6} xs={12} height={'425px'}>
      <Card sx={{ height: '100%' }}>
        <CardActionArea onClick={handleInfo}>
          <CardMedia component="img" height="175px" image={props.image} />
          <CardContent sx={{ height: '120px' }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              align="center"
            >
              {props.name}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              my={1}
            >
              {props.product?.available} {props.product.unitOfMeasure} available
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              fontWeight="bold"
            >
              € {props.price}/{props.product.unitOfMeasure}
            </Typography>
          </CardContent>
        </CardActionArea>
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
  const [sortOption, setSortOption] = useState('No sort');
  const sort = [
    'Highest price',
    'Lowest price',
    'Ascending name',
    'Descending name',
  ];

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

  return (
    <>
      <Grid container direction="row">
        <Grid item xs={12} sm={11}>
          {farmer && (
            <Chip
              sx={{ m: 2 }}
              onDelete={handleDelete}
              variant="outlined"
              label={`Product by ${farmer.name} ${farmer.surname}`}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={1} display={onSelect ? 'none' : 'block'}>
          <TextField
            id="outlined-select-sort"
            select
            value={sortOption}
            label="Sort by"
            sx={{
              width: '200px',
              float: { xs: 'left', sm: 'right' },
              mr: 2,
              ml: 2,
            }}
            onChange={e => handleChange(e.target.value)}
          >
            {sort.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
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
          ?.sort((a, b) => sortProducts(a, b))
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
