import { useContext, useEffect, useState } from 'react';
import { getProducts, Product } from '../api/basil-api';
import { PendingStateContext } from '../contexts/pending';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

export const useProducts = () => {
  const { setPending } = useContext(PendingStateContext);
  const [products, setProducts] = useState<Product[]>(null);
  const [error, setError] = useState<ApiException>(null);
  useEffect(() => {
    setPending(true);
    getProducts()
      .then(setProducts)
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  }, [setPending]);
  return { products, error };
};
