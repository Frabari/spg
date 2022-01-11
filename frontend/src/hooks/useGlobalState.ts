import { createGlobalState } from 'react-hooks-global-state';
import { Notification } from '../api/BasilApi';

const { useGlobalState } = createGlobalState({
  notifications: [] as Notification[],
});

export { useGlobalState };
