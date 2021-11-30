import { createGlobalState } from 'react-hooks-global-state';
import { Order, User, Notification } from '../api/BasilApi';

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState({
  profile: null as User | false,
  basket: null as Partial<Order>,
  profilePending: false,
  basketPending: false,
  pending: false,
  notifications: [] as Notification[],
  newNotification: null as Notification,
});

export { useGlobalState, setGlobalState, getGlobalState };
