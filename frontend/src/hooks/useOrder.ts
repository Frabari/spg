import { useContext, useEffect, useState } from 'react';
import { PendingStateContext } from '../contexts/pending';
import { createOrder, getOrder, Order, OrderId } from '../api/basil-api';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

export const useOrder = (id?: OrderId) => {
  const { setPending } = useContext(PendingStateContext);
  const [order, setOrder] = useState<Order>(null);
  const [error, setError] = useState<ApiException>(null);

  const upsertOrder = (order: Partial<Order>) => {
    if (!order.id) {
      setPending(true);
      return createOrder(order)
        .then(u => {
          setOrder(u);
          return u;
        })
        .catch(e => {
          setError(e);
          toast.error(e.message);
        })
        .finally(() => setPending(false));
    }
  };

  useEffect(() => {
    if (id) {
      setPending(true);
      getOrder(id)
        .then(setOrder)
        .catch(e => {
          setError(e);
          toast.error(e.message);
        })
        .finally(() => setPending(false));
    }
  }, [id, setPending]);
  return { order, upsertOrder, error };
};
