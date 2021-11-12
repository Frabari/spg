import { useContext, useEffect, useState } from 'react';
import { getProducts, Product } from '../api/basil-api';
import { PendingStateContext } from '../contexts/pending';

export const useProducts = () => {
  const { setPending } = useContext(PendingStateContext);
  const [products, setProducts] = useState<Product[]>(null);
  useEffect(() => {
    setPending(true);
    getProducts()
      .then(setProducts)
      .finally(() => setPending(false));
  }, [setPending]);
  return products;
};
