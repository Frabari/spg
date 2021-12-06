import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getBasket, Order, Product, updateBasket } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { useGlobalState } from './useGlobalState';
import { OrderConstraints } from './useOrder';
import { usePendingState } from './usePendingState';
import { useProfile } from './useProfile';

export const useBasket = () => {
  const { setPending: setGlobalPending } = usePendingState();
  const { profile } = useProfile();
  const [pending, setPending] = useGlobalState('basketPending');
  const [basket, setBasket] = useGlobalState('basket');
  const [error, setError] = useState<ApiException<OrderConstraints>>(null);

  const _updateBasket =
    useRef<(basket: Partial<Order>) => Promise<void | Order>>();
  _updateBasket.current = (basket: Partial<Order>) => {
    setPending(true);
    return updateBasket(basket)
      .then(o => {
        setBasket(o);
        return o;
      })
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  };

  const upsertEntry =
    useRef<(product: Product, quantity: number) => Promise<void | Order>>();
  upsertEntry.current = (product: Product, quantity: number) => {
    const dto = { ...(basket as Order) };
    if (!dto.entries) {
      dto.entries = [];
    }
    const existingEntry = dto.entries.find(e => e.product.id === product.id);
    if (existingEntry) {
      if (quantity === 0) {
        dto.entries = dto.entries.filter(e => e !== existingEntry);
      } else {
        existingEntry.quantity += quantity;
      }
    } else {
      dto.entries.push({
        product,
        quantity,
      });
    }
    return _updateBasket.current(dto);
  };

  const deleteEntry = useRef<(product: Product) => Promise<void | Order>>();
  deleteEntry.current = (product: Product) => {
    const dto = { ...(basket as Order) };
    if (!dto.entries) {
      return;
    }
    const existingEntry = dto.entries.find(e => e.product.id === product.id);
    if (existingEntry) {
      dto.entries = dto.entries.filter(e => e.product.id !== product.id);
    }
    return _updateBasket.current(dto);
  };

  const loadBasket = useRef<() => void>();
  loadBasket.current = () => {
    setPending(true);
    getBasket()
      .then(b => {
        setBasket(b);
      })
      .catch(e => {
        setError(e);
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    setGlobalPending(pending);
  }, [pending, setGlobalPending]);

  useEffect(() => {
    if (
      !pending &&
      profile &&
      (profile.id !== basket?.user?.id || basket === null)
    ) {
      loadBasket.current();
    }
  }, [basket, profile, pending]);

  return {
    basket,
    updateBasket: _updateBasket.current,
    upsertEntry: upsertEntry.current,
    deleteEntry: deleteEntry.current,
    loadBasket: loadBasket.current,
    pending,
    error,
  };
};
