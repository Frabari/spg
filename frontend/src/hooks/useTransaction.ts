import { useContext, useState } from 'react';
import { PendingStateContext } from '../contexts/pending';
import {
  createTransaction,
  Transaction,
  TransactionId,
} from '../api/basil-api';
import { toast } from 'react-hot-toast';
import { ApiException } from '../api/createHttpClient';

export const useTransaction = (id?: TransactionId) => {
  const { setPending } = useContext(PendingStateContext);
  const [transaction, setTransaction] = useState<Transaction>(null);
  const [error, setError] = useState<ApiException>(null);

  const upsertTransaction = (transaction: Partial<Transaction>) => {
    if (!transaction.id) {
      setPending(true);
      return createTransaction(transaction)
        .then(t => {
          setTransaction(t);
          return t;
        })
        .catch(e => {
          setError(e);
          toast.error(e.message);
        })
        .finally(() => setPending(false));
    }
  };

  // useEffect(() => {
  //   if (id) {
  //     setPending(true);
  //     getTransaction(id)
  //       .then(setTransaction)
  //       .catch(e => {
  //         setError(e);
  //         toast.error(e.message);
  //       })
  //       .finally(() => setPending(false));
  //   }
  // }, [id, setPending]);
  return { transaction, upsertTransaction, error };
};
