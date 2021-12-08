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
  const [farmer, setFarmer] = useState(null);
  const [balanceWarning, setBalanceWarnig] = useState(false);
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
        balanceWarning={balanceWarning}
      />
      <Container sx={{ mt: 18 }}>
        <ProductsGrid
          farmer={farmer}
          filter={queryParams.get('category')}
          search={search}
          onSelect={null}
          handleDelete={handleDelete}
          setBalanceWarnig={setBalanceWarnig}
        />
      </Container>
    </>
  );
}
