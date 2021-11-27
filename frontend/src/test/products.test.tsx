import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Product, ProductId } from '../api/BasilApi';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';

jest.mock('../api/BasilApi', () => {
  const originalModule = jest.requireActual('../api/BasilApi');
  const mockProduct: Partial<Product> = {
    id: 30,
    name: 'Apple',
  };
  const mockProducts = [
    {
      id: 40,
      name: 'Orange',
    },
    {
      id: 41,
      name: 'Banana',
    },
    {
      id: 42,
      name: 'Ananas',
    },
  ];
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getProduct: (id?: ProductId) => Promise.resolve(mockProduct),
    getProducts: () => Promise.resolve(mockProducts),
  };
});

test('load product', async () => {
  const { result } = renderHook(() => useProduct(30));
  await waitFor(() => expect(result.current.product.name).toEqual('Apple'));
});

test('load products', async () => {
  const { result } = renderHook(() => useProducts());
  await waitFor(() =>
    expect(result.current.products.find(p => p.id === 42).name).toEqual(
      'Ananas',
    ),
  );
});
