import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  createOrder,
  getOrder,
  Order,
  OrderId,
  updateOrder,
} from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useOrder = (id?: OrderId) => {
  const { setPending } = usePendingState();
  const [order, setOrder] = useState<Order>(null);
  const [error, setError] = useState<ApiException>(null);

  const upsertOrder = (order: Partial<Order>) => {
    setPending(true);
    if (!order?.id) {
      return createOrder(order)
        .then(o => {
          setOrder(o);
          return o;
        })
        .catch(e => {
          setError(e);
          toast.error(e.message);
          throw e;
        })
        .finally(() => setPending(false));
    }
    return updateOrder(id, order)
      .then(o => {
        setOrder(o);
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
