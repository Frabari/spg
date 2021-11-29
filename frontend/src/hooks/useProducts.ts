import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getProducts, Product } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useProducts = () => {
  const { setPending } = usePendingState();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<ApiException>(null);

  const loadProducts = useRef<() => void>();
  loadProducts.current = () => {
    setPending(true);
    getProducts()
      .then(setProducts)
      .catch(e => {
        setError(e);
      })
      .finally(() => setPending(false));
  };

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
  return { products, error, loadProducts: loadProducts.current };
};
