import './BasilApi.mock';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { OrderEntry, Product, User } from '../api/BasilApi';
import { useBasket } from '../hooks/useBasket';
import { useUpdateBasket } from '../hooks/useUpdateBasket';
import { wrapper } from './wrapper';

test('basket', async () => {
  const { result } = renderHook(() => useBasket(), { wrapper });
  await waitFor(() => {
    expect(result.current.data.id).toEqual(1);
  });
});

test('update basket', async () => {
  const { result } = renderHook(() => useUpdateBasket(), { wrapper });
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
    let exp = {
      entries: null as OrderEntry[],
      id: -1,
      user: null as User,
    };
    await result.current.upsertEntry(product as Product, 2).then(r => {
      exp.entries = r.entries;
      exp.user = r.user;
      exp.id = r.id;
    });
    return expect(exp).toMatchObject(dto);
  });
});

test('delete entry basket', async () => {
  const { result } = renderHook(() => useUpdateBasket(), { wrapper });
  return act(async () => {
    const product: Partial<Product> = {
      id: 1,
    };
    const dto = {
      id: 1,
      user: { id: 30 },
    };
    let exp = {
      id: -1,
      user: null as User,
    };
    await result.current.deleteEntry(product as Product).then(r => {
      exp.id = r.id;
      exp.user = r.user;
    });
    return expect(exp).toMatchObject(dto);
  });
});
