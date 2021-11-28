import './BasilApi.mock';
import { act, renderHook } from '@testing-library/react-hooks';
import { Transaction } from '../api/BasilApi';
import { useTransaction } from '../hooks/useTransaction';

test('create transaction', async () => {
  const transaction: Partial<Transaction> = {
    amount: 10,
  };

  const { result } = renderHook(() => useTransaction());
  await act(async () =>
    expect(
      (
        await result.current.upsertTransaction(transaction)
      ).amount,
    ).toEqual(10),
  );
});
