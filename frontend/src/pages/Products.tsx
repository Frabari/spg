import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';
import { Navigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/user';
import { Container } from '@mui/material';

export default function Products(props: any) {
  // const [logged, setLogged] = React.useState(false);
  const { user } = useContext(UserContext);

  // useEffect(() => {
  //   if (user) {
  //     setLogged(true);
  //   } else setLogged(false)
  // }, [user]);

  if (user === null) {
    return <Navigate to='/login' />;
  }
  return (
    <>
      <NavigationBox.NavBar loggedIn={1} products={true} />
      <Container style={{backgroundColor: "#fafafa"}}>
        <ProductsGrid />
      </Container>
    </>
  );
}
