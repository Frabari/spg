import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getBasket, Order, Product, updateBasket } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { PendingStateContext } from '../contexts/pending';

export const useBasket = () => {
  const { setPending } = useContext(PendingStateContext);
  const [basket, setBasket] = useState<Order>(null);
  const [error, setError] = useState<ApiException>(null);

  const _updateBasket = (basket: Partial<Order>) => {
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

  const upsertEntry = (product: Product, quantity: number) => {
    const dto = { ...basket };
    if (!dto.entries) {
      dto.entries = [];
    }
    const existingEntry = dto.entries.find(e => e.product.id === product.id);
    if (existingEntry) {
      if (quantity === 0) {
        dto.entries = dto.entries.filter(e => e !== existingEntry);
      } else {
        existingEntry.quantity = quantity;
      }
    } else {
      dto.entries.push({
        product,
        quantity,
      });
    }
    return _updateBasket(dto);
  };

  const deleteEntry = (product: Product) => {
    const dto = { ...basket };
    if (!dto.entries) {
      return;
    }
    const existingEntry = dto.entries.find(e => e.product.id === product.id);
    if (existingEntry) {
      dto.entries = dto.entries.filter(e => e.product.id !== product.id);
    }
    return _updateBasket(dto);
  };

  useEffect(() => {
    setPending(true);
    getBasket()
      .then(setBasket)
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  }, [setPending]);

  return {
    basket,
    updateBasket: _updateBasket,
    upsertEntry,
    deleteEntry,
    error,
  };
};
