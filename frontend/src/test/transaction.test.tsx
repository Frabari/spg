import './BasilApi.mock';
import { act, renderHook } from '@testing-library/react-hooks';
import { Transaction } from '../api/BasilApi';
import { useUpsertTransaction } from '../hooks/useUpsertTransaction';
import { wrapper } from './wrapper';

test('create transaction', async () => {
  const transaction: Partial<Transaction> = {
    amount: 10,
  };

  const { result } = renderHook(() => useUpsertTransaction(), { wrapper });
  await act(async () =>
    expect(
      ((await result.current.upsertTransaction(transaction)) as Transaction)
        .amount,
    ).toEqual(10),
  );
});
