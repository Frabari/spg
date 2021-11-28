import './BasilApi.mock';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Order } from '../api/BasilApi';
import { useOrder } from '../hooks/useOrder';

test('create order', async () => {
  const order: Partial<Order> = {
    deliveryLocation: 'Turin',
  };

  const { result } = renderHook(() => useOrder());
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation,
    ).toEqual('Turin'),
  );
});

test('update order', async () => {
  const order: Partial<Order> = {
    id: 30,
    deliveryLocation: 'Milan',
  };
  const { result } = renderHook(() => useOrder(30));
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation,
    ).toEqual('Milan'),
  );
});

test('get order', async () => {
  const { result } = renderHook(() => useOrder(30));
  await waitFor(() =>
    expect(result.current.order.deliveryLocation).toEqual('Milan'),
  );
});
