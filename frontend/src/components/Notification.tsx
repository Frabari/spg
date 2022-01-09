import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { NotificationType } from '../api/BasilApi';
import { useNotifications } from '../hooks/useNotifications';

export default function Notifications() {
  const { newNotification } = useNotifications();
  const { enqueueSnackbar } = useSnackbar();

  const action = () => (
    <ListItem sx={{ py: 0, pl: 0 }} alignItems="center">
      <ListItemIcon>
        {newNotification?.type === NotificationType.INFO && (
          <InfoOutlinedIcon sx={{ color: 'cornflowerblue' }} />
        )}
        {newNotification?.type === NotificationType.ERROR && (
          <ErrorOutlineIcon color="error" />
        )}
        {newNotification?.type === NotificationType.SUCCESS && (
          <DoneIcon color="primary" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={newNotification?.title}
        secondary={newNotification?.message}
      />
    </ListItem>
  );

  useEffect(() => {
    if (newNotification) {
      enqueueSnackbar(null, { action });
    }
  }, [newNotification]);

  return <></>;
}
