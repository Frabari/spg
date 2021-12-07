import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Order } from '../api/BasilApi';
import { useOrder } from '../hooks/useOrder';
import { useOrders } from '../hooks/useOrders';

test('create order', async () => {
  const order: Partial<Order> = {
    deliveryLocation: { city: 'Turin' },
  };

  const { result } = renderHook(() => useOrder());
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
  const { result } = renderHook(() => useOrder(30));
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation
        .city,
    ).toEqual('Milan'),
  );
});

test('get order', async () => {
  const { result } = renderHook(() => useOrder(30));
  await waitFor(() => {
    console.log('Order', result.current.order);
    expect(result.current.order.deliveryLocation.city).toEqual('Milan');
  });
});

test('get orders', async () => {
  const { result } = renderHook(() => useOrders());
  await waitFor(() =>
    expect(result.current.orders.find(o => o.id === 1).user.id).toEqual(30),
  );
});
