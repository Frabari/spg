import { useEffect } from 'react';
import { Notification, socket } from '../api/BasilApi';
import { useGlobalState } from './useGlobalState';
import { useProfile } from './useProfile';

export const useNotifications = () => {
  const { data: profile } = useProfile();
  const [notifications, setNotifications] = useGlobalState('notifications');
  const [newNotification, setNewNotification] =
    useGlobalState('newNotification');

  useEffect(() => {
    if (profile) {
      socket.off('notification');
      socket.on('notification', (notification: Notification) => {
        notification.read = false;
        setNotifications(prevNotifications => [
          ...prevNotifications,
          notification,
        ]);
        setNewNotification(notification);
      });
      setNotifications(profile.notifications ?? []);
    }
  }, [profile, setNotifications, setNewNotification]);

  return {
    newNotification,
    enqueueNotification: setNewNotification,
    notifications,
  };
};
