import { useState } from 'react';
import { Link, Route, Routes, useSearchParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { Box, Container, Grid, IconButton, Typography } from '@mui/material';
import { ProductsByFarmer } from '../components/ProductsByFarmer';
import { useCategories } from '../hooks/useCategories';
import { NavBar } from './Navigation';
import { ProductInfo } from './ProductInfo';

const Footer = () => {
  return (
    <Box
      sx={{
        background: '#f1f1f1',
        py: 8,
        px: 1,
        marginTop: '50vh',
      }}
    >
      <Container>
        <Typography textAlign="center" fontSize={11} color="#AAA">
          Food images and people photos credits belong to{' '}
          <a
            href="https://unsplash.com/@mockupgraphics"
            title="mockupgraphics"
            style={{ color: '#AAA' }}
          >
            @mockupgraphics
          </a>{' '}
          from{' '}
          <a
            href="https://unsplash.com/"
            title="unsplash"
            style={{ color: '#AAA' }}
          >
            www.unsplash.com
          </a>
          . Home illustration by Freepik
        </Typography>
      </Container>
    </Box>
  );
};

export const Products = () => {
  const { data: categories } = useCategories();
  const [category] = useState(0);
  const [search, setSearch] = useState('');
  const [queryParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  return (
    <>
      <NavBar handleSearch={handleSearch} onProducts={true} />
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
                        <ArrowBack />
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
};
