import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useVirtualClock } from '../hooks/useVirtualClock';

test('set date', async () => {
  const { result } = renderHook(() => useVirtualClock());
  await waitFor(() => {
    expect(result.current[0]).toBeDefined();
  });
});
