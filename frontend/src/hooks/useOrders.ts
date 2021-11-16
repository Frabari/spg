import { useContext, useEffect, useState } from 'react';
import { getOrders, Order } from '../api/BasilApi';
import { PendingStateContext } from '../contexts/pending';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

export const useOrders = () => {
  const { setPending } = useContext(PendingStateContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<ApiException>(null);
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
  return { orders, error };
};
