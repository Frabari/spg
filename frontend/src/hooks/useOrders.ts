import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getOrders, Order } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useOrders = () => {
  const { setPending: setGlobalPending } = usePendingState();
  const [pending, setPending] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<ApiException>(null);

  useEffect(() => {
    setGlobalPending(pending);
  }, [pending, setGlobalPending]);

  useEffect(() => {
    setPending(true);
    getOrders()
      .then(setOrders)
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  }, [setPending]);
  return { orders, pending, error };
};
