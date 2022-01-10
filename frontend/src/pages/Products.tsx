import React, { useState } from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  BottomNavigation,
  Box,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import ProductsByFarmer from '../components/ProductsByFarmer';
import { useCategories } from '../hooks/useCategories';
import NavigationBox from './Navigation';
import ProductInfo from './ProductInfo';

const Footer = () => {
  return (
    <Box
      sx={{ width: '100%', position: 'relative', bottom: 0, left: 0, right: 0 }}
    >
      <BottomNavigation>
        <Stack>
          <Typography textAlign="center">
            Food images and people photos credits belong to{' '}
            <a
              href="https://unsplash.com/@mockupgraphics"
              title="mockupgraphics"
            >
              @mockupgraphics
            </a>{' '}
            from{' '}
            <a href="https://unsplash.com/" title="unsplash">
              www.unsplash.com
            </a>
          </Typography>
        </Stack>
      </BottomNavigation>
    </Box>
  );
};

export default function Products() {
  const { data: categories } = useCategories();
  const [category, setCategory] = useState(0);
  const [search, setSearch] = useState('');
  const [queryParams, setSearchParams] = useSearchParams();
  const [balanceWarning, setBalanceWarning] = useState(false);

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  return (
    <>
      <NavigationBox.NavBar
        loggedIn={1}
        products={true}
        handleSearch={handleSearch}
        farmer={queryParams.get('farmer')}
        setSearchParams={setSearchParams}
        balanceWarning={balanceWarning}
        onProducts={true}
        setCategory={setCategory}
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Container sx={{ mt: 18 }}>
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  mb={2}
                  alignItems="center"
                >
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
                      sx={{
                        minWidth: '6rem',
                        fontSize: { sm: 28 },
                        mr: 'auto',
                      }}
                    >
                      {category !== 0 &&
                        categories.find(c => c.id === category).name}
                    </Typography>
                  </Grid>
                </Grid>
                <ProductsByFarmer
                  farmer={queryParams.get('farmer')}
                  filter={queryParams.get('category') || ''}
                  queryParams={queryParams}
                  setSearchParams={setSearchParams}
                  search={search}
                  onSelect={null}
                  setBalanceWarning={setBalanceWarning}
                />
              </Container>
              <Footer />
            </>
          }
        />
        <Route path="/:id" element={<ProductInfo />} />
      </Routes>
    </>
  );
}
