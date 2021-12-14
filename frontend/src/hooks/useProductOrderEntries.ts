import { useEffect, useState } from 'react';
import {
  getProductOrderEntries,
  OrderEntry,
  ProductId,
  updateProductOrderEntries,
} from '../api/BasilApi';
import { usePendingState } from './usePendingState';

export const useProductOrderEntries = (id: ProductId) => {
  const [entries, _setEntries] = useState<OrderEntry[]>([]);
  const [pending, setPending] = useState(false);
  const { setPending: setGlobalPending } = usePendingState();

  useEffect(() => {
    setGlobalPending(pending);
  }, [pending, setGlobalPending]);

  const setEntries = (dto: Partial<OrderEntry>) => {
    setPending(true);
    updateProductOrderEntries(id, dto)
      .then(e => {
        _setEntries(e);
      })
      .catch(() => {
        // noop
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    if (id != null) {
      setPending(true);
      getProductOrderEntries(id)
        .then(e => {
          _setEntries(e);
        })
        .catch(() => {
          // noop
        })
        .finally(() => setPending(false));
    }
  }, [id, pending]);

  return { entries, setEntries };
};
