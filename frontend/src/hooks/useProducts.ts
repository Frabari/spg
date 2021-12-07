import { useEffect, useRef, useState } from 'react';
import { getProducts, Product } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useProducts = (loadAllStock = false) => {
  const { setPending: setGlobalPending } = usePendingState();
  const [pending, setPending] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<ApiException>(null);

  useEffect(() => {
    setGlobalPending(pending);
  }, [pending, setGlobalPending]);

  const loadProducts = useRef<() => void>();
  loadProducts.current = () => {
    setPending(true);
    getProducts(loadAllStock)
      .then(setProducts)
      .catch(e => {
        setError(e);
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    setPending(true);
    getProducts(loadAllStock)
      .then(setProducts)
      .catch(e => {
        setError(e);
      })
      .finally(() => setPending(false));
  }, [loadAllStock, setPending]);
  return { products, loadProducts: loadProducts.current, pending, error };
};
