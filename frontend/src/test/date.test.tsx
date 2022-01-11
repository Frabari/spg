import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useDate } from '../hooks/useDate';
import { wrapper } from './wrapper';

test('update date', async () => {
  const { result } = renderHook(() => useDate(), { wrapper });
  await waitFor(() => expect(result.current).toBeDefined());
});
