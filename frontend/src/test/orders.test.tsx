import { act, renderHook } from '@testing-library/react-hooks';
import { Order } from '../api/BasilApi';
import { PendingStateContext } from '../contexts/pending';
import { useOrder } from '../hooks/useOrder';

jest.mock('../api/BasilApi', () => {
  const originalModule = jest.requireActual('../api/BasilApi');
  const order: Partial<Order> = {
    id: 30,
    deliveryLocation: 'Turin',
  };
  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    createOrder: (_order: Partial<Order>) => Promise.resolve(order),
  };
});

test('create order', async () => {
  const order: Partial<Order> = {
    deliveryLocation: 'Turin',
  };
  // @ts-ignore
  const wrapper = ({ children }) => (
    <PendingStateContext.Provider
      value={{ pending: true, setPending: (value: boolean) => true }}
    >
      {children}
    </PendingStateContext.Provider>
  );

  const { result } = renderHook(() => useOrder(), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertOrder(order)) as Order).deliveryLocation,
    ).toEqual('Turin'),
  );
});
