import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useStockItem } from '../hooks/useStockItem';
import { wrapper } from './wrapper';

test('load item', async () => {
  const { result } = renderHook(() => useStockItem(30), { wrapper });
  await waitFor(() => expect(result.current.data.name).toEqual('Apple'));
});
