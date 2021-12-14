import { useEffect, useState } from 'react';
import {
  getProductOrderEntries,
  OrderEntry,
  ProductId,
  updateProductOrderEntries,
} from '../api/BasilApi';

export const useProductOrderEntries = (id: ProductId) => {
  const [entries, _setEntries] = useState<OrderEntry[]>([]);
  const setEntries = (dto: Partial<OrderEntry>) => {
    updateProductOrderEntries(id, dto)
      .then(e => {
        _setEntries(e);
      })
      .catch(() => {
        // noop
      });
  };

  useEffect(() => {
    getProductOrderEntries(id)
      .then(e => {
        _setEntries(e);
      })
      .catch(() => {
        // noop
      });
  }, [id]);

  return {entries, setEntries};
};
