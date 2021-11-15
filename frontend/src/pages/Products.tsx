import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';
import { UserContext } from '../contexts/user';

export default function Products() {
  const { user } = useContext(UserContext);
  const [filter, setFilter] = useState();

  if (user === null) {
    return <Navigate to="/login" />;
  }

  const handleFilter = (value: any) => {
    setFilter(value);
  };

  return (
    <>
      <NavigationBox.NavBar
        loggedIn={1}
        products={true}
        handleFilter={handleFilter}
      />
      <Container sx={{ mt: 18 }}>
        <ProductsGrid filter={filter} />
      </Container>
    </>
  );
}
