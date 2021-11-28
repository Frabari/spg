import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useCategories } from '../hooks/useCategories';

test('load products', async () => {
  const { result } = renderHook(() => useCategories());
  await waitFor(() =>
    expect(result.current.categories.find(c => c.id === 42).name).toEqual(
      'Fruits',
    ),
  );
});
