import { useEffect, useRef } from 'react';
import { Notification, socket } from '../api/BasilApi';
import { useGlobalState } from './useGlobalState';
import { useProfile } from './useProfile';

export const useNotifications = (
  onNotification: (notification: Notification) => void,
) => {
  const { profile } = useProfile();
  const [notifications, setNotifications] = useGlobalState('notifications');

  const _onNotification = useRef<(notification: Notification) => void>();
  _onNotification.current = (notification: Notification) => {
    setNotifications(prevNotifications => [...prevNotifications, notification]);
    onNotification(notification);
  };

  useEffect(() => {
    if (profile) {
      socket.off('notification');
      socket.on('notification', n => _onNotification.current(n));
      setNotifications(profile.notifications ?? []);
    }
    return () => {
      socket.disconnect();
    };
  }, [profile]);

  return {
    notifications,
  };
};
