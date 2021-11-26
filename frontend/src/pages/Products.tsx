import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import { useProfile } from '../hooks/useProfile';
import NavigationBox from './Navigation';

export default function Products() {
  const { profile } = useProfile();
  const [search, setSearch] = useState('');
  const [queryParams] = useSearchParams();

  if (!profile) {
    return <Navigate to="/" />;
  }

  const handleSearch = (value: any) => {
    setSearch(value);
  };

  return (
    <>
      <NavigationBox.NavBar
        loggedIn={1}
        products={true}
        handleSearch={handleSearch}
      />
      <Container sx={{ mt: 18 }}>
        <ProductsGrid
          filter={queryParams.get('category')}
          search={search}
          onSelect={null}
        />
      </Container>
    </>
  );
}
