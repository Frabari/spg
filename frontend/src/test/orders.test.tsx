import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Order } from '../api/BasilApi';
import { useOrder } from '../hooks/useOrder';
import { useOrders } from '../hooks/useOrders';
import { useUpsertOrder } from '../hooks/useUpsertOrder';
import { wrapper } from './wrapper';

test('create order', async () => {
  const order: Partial<Order> = {
    deliveryLocation: { city: 'Turin' },
  };

  const { result } = renderHook(() => useUpsertOrder(), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation
        .city,
    ).toEqual('Turin'),
  );
});

test('update order', async () => {
  const order: Partial<Order> = {
    id: 30,
    deliveryLocation: { city: 'Milan' },
  };
  const { result } = renderHook(() => useUpsertOrder(), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation
        .city,
    ).toEqual('Milan'),
  );
});

test('get order', async () => {
  const { result } = renderHook(() => useOrder(30), { wrapper });
  await waitFor(() => {
    expect(result.current.data.deliveryLocation.city).toEqual('Milan');
  });
});

test('get orders', async () => {
  const { result } = renderHook(() => useOrders(), { wrapper });
  await waitFor(() =>
    expect(result.current.data.find(o => o.id === 1).user.id).toEqual(30),
  );
});
