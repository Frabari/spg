import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useUpdateProductOrderEntries } from '../hooks/useUpdateProductOrderEntries';
import { wrapper } from './wrapper';

test('update product order entries', async () => {
  const { result } = renderHook(() => useUpdateProductOrderEntries(), {
    wrapper,
  });
  await waitFor(() => expect(result.current).toBeDefined());
});
