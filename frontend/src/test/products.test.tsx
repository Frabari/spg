import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Product } from '../api/BasilApi';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
import { useUpsertStockItem } from '../hooks/useUpsertStockItem';
import { wrapper } from './wrapper';

test('create product', async () => {
  const product: Partial<Product> = {
    name: 'Kale',
  };

  const { result } = renderHook(() => useUpsertStockItem(), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertStockItem(product)) as Product).name,
    ).toEqual('Kale'),
  );
});

test('update product', async () => {
  const product: Partial<Product> = {
    id: 30,
    name: 'Kale',
  };
  const { result } = renderHook(() => useUpsertStockItem(), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertStockItem(product)) as Product).name,
    ).toEqual('Kale'),
  );
});

test('load product', async () => {
  const { result } = renderHook(() => useProduct(30), { wrapper });
  await waitFor(() => expect(result.current.data.name).toEqual('Kale'));
});

test('load products', async () => {
  const { result } = renderHook(() => useProducts(), { wrapper });
  await waitFor(() => {
    expect(result.current.data.find(p => p.id === 42).name).toEqual('Ananas');
  });
});
