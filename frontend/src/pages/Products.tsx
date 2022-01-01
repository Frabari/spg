import { useState } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';
import ProductInfo from './ProductInfo';

export default function Products() {
  const { profile } = useProfile();
  const [basketListener, setBasketListener] = useState(false);
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
        basketListener={basketListener}
        setBasketListener={setBasketListener}
        onProducts={true}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Container sx={{ mt: 18 }}>
              <ProductsGrid
                farmer={queryParams.get('farmer')}
                filter={queryParams.get('category') || ''}
                setSearchParams={setSearchParams}
                search={search}
                onSelect={null}
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
