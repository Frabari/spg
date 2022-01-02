import { useState } from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Container, Grid, IconButton, Typography } from '@mui/material';
import ProductsByFarmer from '../components/ProductsByFarmer';
import { useCategories } from '../hooks/useCategories';
import NavigationBox from './Navigation';
import ProductInfo from './ProductInfo';

export default function Products() {
  const { categories } = useCategories();
  const [category, setCategory] = useState(0);
  const [basketListener, setBasketListener] = useState(false);
  const [search, setSearch] = useState('');
  const [queryParams] = useSearchParams();
  const [farmer, setFarmer] = useState(null);
  const [balanceWarning, setBalanceWarning] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  const handleDelete = () => {
    setFarmer('');
  };

  return (
    <>
      <NavigationBox.NavBar
        farmer={farmer}
        setFarmer={setFarmer}
        loggedIn={1}
        products={true}
        handleSearch={handleSearch}
        balanceWarning={balanceWarning}
        basketListener={basketListener}
        setBasketListener={setBasketListener}
        onProducts={true}
        setCategory={setCategory}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Container sx={{ mt: 18 }}>
              <Grid container direction="row" spacing={1}>
                {category !== 0 && (
                  <Grid item>
                    <IconButton component={Link} to={`/products`}>
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid>
                )}
                <Grid item>
                  <Typography
                    variant="h6"
                    noWrap
                    component="h1"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ minWidth: '6rem', fontSize: { sm: 28 }, mr: 'auto' }}
                  >
                    {category !== 0 &&
                      categories.find(c => c.id === category).name}
                  </Typography>
                </Grid>
              </Grid>
              <ProductsByFarmer
                farmer={farmer}
                filter={queryParams.get('category')}
                search={search}
                onSelect={null}
                handleDelete={handleDelete}
                setBalanceWarning={setBalanceWarning}
                basketListener={basketListener}
                setBasketListener={setBasketListener}
              />
            </Container>
          }
        />
        <Route path="/:id" element={<ProductInfo />} />
      </Routes>
    </>
  );
}
