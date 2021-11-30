import './BasilApi.mock';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { Product } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';

test('basket', async () => {
  const { result } = renderHook(() => useBasket());
  await waitFor(() => {
    expect(result.current.basket.id).toEqual(1);
  });
});

test('update basket', async () => {
  const { result } = renderHook(() => useBasket());
  return act(async () => {
    const product: Partial<Product> = {
      id: 1,
    };
    const dto = {
      id: 1,
      user: { id: 30 },
      entries: [
        {
          id: 1,
          product: { id: 1 } as Product,
          quantity: 4,
        },
      ],
    };
    return expect(
      await result.current.upsertEntry(product as Product, 2),
    ).toMatchObject(dto);
  });
});

test('delete entry basket', async () => {
  const { result } = renderHook(() => useBasket());
  return act(async () => {
    const product: Partial<Product> = {
      id: 1,
    };
    const dto = {
      id: 1,
      user: { id: 30 },
    };
    return expect(
      await result.current.deleteEntry(product as Product),
    ).toMatchObject(dto);
  });
});
