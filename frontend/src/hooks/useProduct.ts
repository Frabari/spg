import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  createProduct,
  getProduct,
  Product,
  ProductId,
  updateProduct,
} from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useProduct = (id?: ProductId) => {
  const { setPending } = usePendingState();
  const [product, setProduct] = useState<Product>(null);
  const [error, setError] = useState<ApiException>(null);

  const upsertProduct = (product: Partial<Product>) => {
    setPending(true);
    if (!product?.id) {
      return createProduct(product)
        .then(o => {
          setProduct(o);
          return o;
        })
        .catch(e => {
          setError(e);
          toast.error(e.message);
          throw e;
        })
        .finally(() => setPending(false));
    }
    return updateProduct(id, product)
      .then(o => {
        setProduct(o);
        return o;
      })
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    if (id) {
      setPending(true);
      getProduct(id)
        .then(setProduct)
        .catch(e => {
          setError(e);
          toast.error(e.message);
        })
        .finally(() => setPending(false));
    }
  }, [id, setPending]);
  return { product, upsertProduct, error };
};
