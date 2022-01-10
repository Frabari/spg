import React, { useEffect } from 'react';
import { SnackbarContent, useSnackbar } from 'notistack';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Grid, Paper, Typography } from '@mui/material';
import { Notification, NotificationType, socket } from '../api/BasilApi';
import { useGlobalState } from './useGlobalState';
import { useProfile } from './useProfile';

const icons = {
  [NotificationType.SUCCESS]: <DoneIcon color="primary" />,
  [NotificationType.ERROR]: <ErrorOutlineIcon color="error" />,
  [NotificationType.INFO]: (
    <InfoOutlinedIcon sx={{ color: 'cornflowerblue' }} />
  ),
};

export const useNotifications = () => {
  const { data: profile } = useProfile();
  const [notifications, setNotifications] = useGlobalState('notifications');
  const { enqueueSnackbar } = useSnackbar();

  const enqueueNotification = (
    notification: Pick<Notification, 'title' | 'message' | 'type'>,
  ) => {
    enqueueSnackbar(null, {
      content: () => (
        <SnackbarContent
          style={{
            width: '350px',
            backgroundColor: 'white',
            color: 'black',
            alignContent: 'center',
            marginRight: 50,
          }}
        >
          <Grid
            flexWrap="nowrap"
            container
            gap={2}
            component={Paper}
            elevation={8}
            flexDirection="row"
            p={2}
          >
            <Grid item>{icons[notification.type]}</Grid>
            <Grid item>
              <Typography fontWeight="bold">{notification.title}</Typography>
              <Typography> {notification.message}</Typography>
            </Grid>
          </Grid>
        </SnackbarContent>
      ),
    });
  };

  useEffect(() => {
    if (profile) {
      socket.off('notification');
      socket.on('notification', (notification: Notification) => {
        notification.read = false;
        setNotifications(prevNotifications => [
          ...prevNotifications,
          notification,
        ]);
        enqueueNotification(notification);
      });
      setNotifications(profile.notifications ?? []);
    }
  }, [profile, setNotifications]);

  return {
    enqueueNotification,
    notifications,
  };
};
