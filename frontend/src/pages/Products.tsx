import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { getGlobalState } from '../App';
import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';

export default function Products() {
  const user = getGlobalState('user');
  const [search, setSearch] = useState('');
  const [queryParams] = useSearchParams();

  if (!user) {
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
