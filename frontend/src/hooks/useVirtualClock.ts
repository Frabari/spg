import { useEffect } from 'react';
import { DateTime, Settings } from 'luxon';
import * as api from '../api/BasilApi';
import { useGlobalState } from './useGlobalState';

export const useVirtualClock = () => {
  const [date, _setDate] = useGlobalState('date');
  const setDate = (date: DateTime) => {
    api
      .setDate({ date: date.toISO() })
      .then(d => {
        const newDate = DateTime.fromISO(d.date);
        _setDate(newDate);
        Settings.now = () => newDate.toMillis();
      })
      .catch(e => {
        // noop
      });
  };

  useEffect(() => {
    api
      .getDate()
      .then(d => {
        const newDate = DateTime.fromISO(d.date);

        _setDate(newDate);
        Settings.now = () => newDate.toMillis();
      })
      .catch(e => {
        // noop
      });
  }, []);

  return [date, setDate] as const;
};
