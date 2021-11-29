import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Product } from '../api/BasilApi';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';

test('create product', async () => {
  const product: Partial<Product> = {
    name: 'Kale',
  };

  const { result } = renderHook(() => useProduct());
  await act(async () =>
    expect(
      ((await result.current.upsertProduct(product)) as Product).name,
    ).toEqual('Kale'),
  );
});

test('update product', async () => {
  const product: Partial<Product> = {
    id: 30,
    name: 'Kale',
  };
  const { result } = renderHook(() => useProduct(30));
  await act(async () =>
    expect(
      ((await result.current.upsertProduct(product)) as Product).name,
    ).toEqual('Kale'),
  );
});

test('load product', async () => {
  const { result } = renderHook(() => useProduct(30));
  await waitFor(() => expect(result.current.product.name).toEqual('Kale'));
});

test('load products', async () => {
  const { result } = renderHook(() => useProducts());
  await waitFor(() => {
    expect(result.current.products.find(p => p.id === 42).name).toEqual(
      'Ananas',
    );
  });
});
