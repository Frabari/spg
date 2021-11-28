import { useState } from 'react';
import { Navigate, Routes, Route, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';
import ProductInfo from './ProductInfo';

export default function Products() {
  const { profile } = useProfile();
  const [search, setSearch] = useState('');
  const [queryParams] = useSearchParams();
  const [farmer, setFarmer] = useState(null);

  if (!profile) {
    return <Navigate to="/" />;
  }

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
              />
            </Container>
          }
        />
        <Route path="/:id" element={<ProductInfo />} />
      </Routes>
    </>
  );
}
