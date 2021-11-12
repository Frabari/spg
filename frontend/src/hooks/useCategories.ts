import { useContext, useEffect, useState } from 'react';
import { Category, getCategories } from '../api/basil-api';
import { PendingStateContext } from '../contexts/pending';

export const useCategories = () => {
  const { setPending } = useContext(PendingStateContext);
  const [categories, setCategories] = useState<Category[]>(null);
  useEffect(() => {
    setPending(true);
    getCategories()
      .then(setCategories)
      .finally(() => setPending(false));
  }, [setPending]);
  return categories;
};
