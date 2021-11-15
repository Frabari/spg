import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';
import { UserContext } from '../contexts/user';

export default function Products(props: any) {
  const { user } = useContext(UserContext);
  const [filter, setFilter] = useState();

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleFilter = (value: any) => {
    setFilter(value);
  };

  return (
    <>
      <NavigationBox.NavBar
        loggedIn={1}
        products={true}
        user={props.user}
        handleFilter={handleFilter}
      />
      <Container sx={{ mt: 18 }}>
        <ProductsGrid filter={filter} onSelect={null}/>
      </Container>
    </>
  );
}
