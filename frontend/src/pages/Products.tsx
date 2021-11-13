import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';
import { UserContext } from '../contexts/user';

export default function Products() {
  const { user } = useContext(UserContext);

  if (user === null) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <NavigationBox.NavBar loggedIn={1} products={true} />
      <Container sx={{ mt: 18 }}>
        <ProductsGrid />
      </Container>
    </>
  );
}
