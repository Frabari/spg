import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useDate } from '../hooks/useDate';
import { wrapper } from './wrapper';

test('set date', async () => {
  const { result } = renderHook(() => useDate(), { wrapper });
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});
