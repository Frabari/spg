import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Order, Product } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';

test('basket', async () => {
  const { result } = renderHook(() => useBasket());
  await waitFor(() => {
    expect(result.current.basket.id).toEqual(1);
  });
});

test('updateBasket', async () => {
  const { result } = renderHook(() => useBasket());
  return act(async () => {
    const dto = {
      id: 1,
      user: { id: 1 },
      entries: [
        {
          id: 1,
          product: { id: 1 } as Product,
          quantity: 2,
        },
      ],
    };
    return expect(
      await result.current.updateBasket(dto as Order),
    ).toMatchObject(dto);
  });
});

test('upsert Empty Basket', async () => {
  const { result } = renderHook(() => useBasket());
  return act(async () => {
    const product: Partial<Product> = {
      id: 1,
    };
    const dto = {
      id: 1,
      user: { id: 1 },
      entries: [
        {
          id: 1,
          product: { id: 1 } as Product,
          quantity: 2,
        },
      ],
    };
    return expect(
      await result.current.upsertEntry(product as Product, 2),
    ).toMatchObject(dto);
  });
});

test('delete entry', async () => {
  const { result } = renderHook(() => useBasket());
  return act(async () => {
    const product: Partial<Product> = {
      id: 1,
    };
    const dto = {
      id: 1,
      user: { id: 1 },
    };
    return expect(
      await result.current.deleteEntry(product as Product),
    ).toMatchObject(dto);
  });
});
