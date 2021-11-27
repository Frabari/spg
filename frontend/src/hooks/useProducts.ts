import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getProducts, Product } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { PendingStateContext } from '../contexts/pending';

export const useProducts = () => {
  const { setPending } = useContext(PendingStateContext);
  const [products, setProducts] = useState<Product[]>([]);
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
