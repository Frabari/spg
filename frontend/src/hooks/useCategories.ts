import { useContext, useEffect, useState } from 'react';
import { Category, getCategories } from '../api/BasilApi';
import { PendingStateContext } from '../contexts/pending';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

export const useCategories = () => {
  const { setPending } = useContext(PendingStateContext);
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
