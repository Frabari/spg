import { useState } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsByFarmer from '../components/ProductsByFarmer';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';
import ProductInfo from './ProductInfo';

export default function Products() {
  const { profile } = useProfile();
  const [basketListener, setBasketListener] = useState(false);
  const [search, setSearch] = useState('');
  const [queryParams] = useSearchParams();
  const [farmer, setFarmer] = useState(null);
  const [balanceWarning, setBalanceWarning] = useState(false);

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
      />
      <Routes>
        <Route
          path="/"
          element={
            <Container sx={{ mt: 18 }}>
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
