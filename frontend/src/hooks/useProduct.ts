import { useContext, useEffect, useState } from 'react';
import { PendingStateContext } from '../contexts/pending';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';
import { getProduct, Product, ProductId } from '../api/basil-api';

export const useProduct = (id?: ProductId) => {
  const { setPending } = useContext(PendingStateContext);
  const [product, setProduct] = useState<Product>(null);
  const [error, setError] = useState<ApiException>(null);

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
  return { product, error };
};
