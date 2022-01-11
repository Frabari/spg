import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useCategories } from '../hooks/useCategories';
import { wrapper } from './wrapper';

test('load products', async () => {
  const { result } = renderHook(() => useCategories(), { wrapper });
  await waitFor(() =>
    expect(result.current.data.find(c => c.id === 42).name).toEqual('Fruits'),
  );
});
