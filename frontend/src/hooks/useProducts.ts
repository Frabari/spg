import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getProducts, Product } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useProducts = (loadAllStock = false) => {
  const { setPending } = usePendingState();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<ApiException>(null);
  useEffect(() => {
    setPending(true);
    getProducts(loadAllStock)
      .then(setProducts)
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  }, [loadAllStock, setPending]);
  return { products, error };
};
