import { useEffect } from 'react';
import { Settings } from 'luxon';
import * as api from '../api/BasilApi';
import { useGlobalState } from './useGlobalState';

export const useVirtualClock = () => {
  const [date, _setDate] = useGlobalState('date');
  const setDate = (date: Date) => {
    api
      .setDate({ date: date.toString() })
      .then(d => {
        const newDate = new Date(d);
        _setDate(newDate);
        Settings.now = () => newDate.getTime();
      })
      .catch(e => {
        // noop
      });
  };

  useEffect(() => {
    api
      .getDate()
      .then(d => {
        const newDate = new Date(d);
        _setDate(newDate);
        Settings.now = () => newDate.getTime();
      })
      .catch(e => {
        // noop
      });
  }, []);

  return [date, setDate];
};
