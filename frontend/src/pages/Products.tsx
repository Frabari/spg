import { useState } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';
import ProductInfo from './ProductInfo';

export default function Products() {
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
        onProducts={true}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Container sx={{ mt: 18 }}>
              <ProductsGrid
                farmer={farmer}
                filter={queryParams.get('category')}
                search={search}
                onSelect={null}
                handleDelete={handleDelete}
                setBalanceWarning={setBalanceWarning}
              />
            </Container>
          }
        />
        <Route path="/:id" element={<ProductInfo />} />
      </Routes>
    </>
  );
}
