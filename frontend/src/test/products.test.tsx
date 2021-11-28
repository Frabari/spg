import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';

test('load product', async () => {
  const { result } = renderHook(() => useProduct(30));
  await waitFor(() => expect(result.current.product.name).toEqual('Apple'));
});

test('load products', async () => {
  const { result } = renderHook(() => useProducts());
  await waitFor(() => {
    expect(result.current.products.find(p => p.id === 42).name).toEqual(
      'Ananas',
    );
  });
});
