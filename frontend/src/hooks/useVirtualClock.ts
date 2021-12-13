import { useEffect, useState } from 'react';
import * as api from '../api/BasilApi';

export const useVirtualClock = () => {
  const [date, _setDate] = useState(new Date());
  const setDate = (date: Date) => {
    api
      .setDate({ date: date.toString() })
      .then(d => _setDate(new Date(d)))
      .catch(e => {
        // noop
      });
  };

  useEffect(() => {
    api
      .getDate()
      .then(d => _setDate(new Date(d)))
      .catch(e => {
        // noop
      });
  }, []);

  return [date, setDate];
};
