import { useMutation, useQueryClient } from 'react-query';
import { createTransaction, Transaction } from '../api/BasilApi';

export const useUpsertTransaction = () => {
  const client = useQueryClient();
  const createMutation = useMutation(createTransaction);
  const upsertTransaction = (transaction: Partial<Transaction>) => {
    if (!transaction?.id) {
      return createMutation.mutateAsync(transaction, {
        onSuccess(transaction) {
          if (transaction.user) {
            return client.invalidateQueries(['user', transaction.user.id]);
          }
        },
      });
    }
  };
  return {
    upsertTransaction,
  };
};
