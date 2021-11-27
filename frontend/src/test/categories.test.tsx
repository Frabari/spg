import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useCategories } from '../hooks/useCategories';

jest.mock('../api/BasilApi', () => {
  const originalModule = jest.requireActual('../api/BasilApi');
  const mockCategories = [
    {
      id: 41,
      name: 'Vegetables',
    },
    {
      id: 42,
      name: 'Fruits',
    },
  ];
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getCategories: () => Promise.resolve(mockCategories),
  };
});

test('load products', async () => {
  const { result } = renderHook(() => useCategories());
  await waitFor(() =>
    expect(result.current.categories.find(c => c.id === 42).name).toEqual(
      'Fruits',
    ),
  );
});
