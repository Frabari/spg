import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Order } from '../api/BasilApi';
import { PendingStateContext } from '../contexts/pending';
import { useOrder } from '../hooks/useOrder';

// @ts-ignore
const wrapper = ({ children }) => (
  <PendingStateContext.Provider
    value={{ pending: true, setPending: (value: boolean) => true }}
  >
    {children}
  </PendingStateContext.Provider>
);

jest.mock('../api/BasilApi', () => {
  const originalModule = jest.requireActual('../api/BasilApi');
  let order: Partial<Order> = {
    id: 30,
  };
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createOrder: (_order: Partial<Order>) => {
      order = _order;
      return Promise.resolve(order);
    },
    updateOrder: (_id: number, _order: Partial<Order>) => {
      order = _order;
      return Promise.resolve(order);
    },
    getOrder: (_id: number) => Promise.resolve(order),
  };
});

test('create order', async () => {
  const order: Partial<Order> = {
    deliveryLocation: 'Turin',
  };

  const { result } = renderHook(() => useOrder(), { wrapper });
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
  const { result } = renderHook(() => useOrder(30), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation,
    ).toEqual('Milan'),
  );
});

test('get order', async () => {
  const { result } = renderHook(() => useOrder(30), { wrapper });
  await waitFor(() =>
    expect(result.current.order.deliveryLocation).toEqual('Milan'),
  );
});
