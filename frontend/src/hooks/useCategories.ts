import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Category, getCategories } from '../api/BasilApi';
import { ApiException } from '../api/createHttpClient';
import { usePendingState } from './usePendingState';

export const useCategories = () => {
  const { setPending } = usePendingState();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<ApiException>(null);
  useEffect(() => {
    setPending(true);
    getCategories()
      .then(setCategories)
      .catch(e => {
        setError(e);
        toast.error(e.message);
      })
      .finally(() => setPending(false));
  }, [setPending]);
  return { categories, error };
};
