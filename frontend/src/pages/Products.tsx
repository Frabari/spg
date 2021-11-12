import ProductsGrid from '../components/ProductsGrid';
import NavigationBox from './Navigation';
import React, { useContext } from 'react';
import { UserContext } from '../contexts/user';

export default function Products() {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavigationBox.NavBar loggedIn={1} />
      <NavigationBox.NavTabs />
      <ProductsGrid />
    </>
  );
}
