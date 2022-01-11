import { useMutation, useQueryClient } from 'react-query';
import { createTransaction, Transaction } from '../api/BasilApi';
import { USER_QUERY } from './useUser';

export const useUpsertTransaction = () => {
  const client = useQueryClient();
  const createMutation = useMutation(createTransaction);
  const upsertTransaction = (transaction: Partial<Transaction>) => {
    if (!transaction?.id) {
      return createMutation.mutateAsync(transaction, {
        onSuccess(transaction) {
          if (transaction.user) {
            return client.invalidateQueries([USER_QUERY, transaction.user.id]);
          }
        },
      });
    }
  };
  return {
    upsertTransaction,
  };
};
