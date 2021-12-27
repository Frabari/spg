import React, { useEffect, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import { NotificationType } from '../api/BasilApi';
import { useNotifications } from '../hooks/useNotifications';

export default function Notifications() {
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const { newNotification } = useNotifications();

  useEffect(() => {
    if (newNotification) {
      setNotification(newNotification);
      setOpen(true);
    }
  }, [newNotification]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  type TransitionProps = Omit<SlideProps, 'direction'>;

  function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
  }

  return (
    <Snackbar
      key="notification-snackbar"
      onClose={handleClose}
      sx={{ maxWidth: '350px' }}
      autoHideDuration={6000}
      TransitionComponent={TransitionLeft}
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <SnackbarContent
        sx={{ py: 0, color: 'black', backgroundColor: 'white' }}
        message={
          <ListItem alignItems="flex-start">
            <ListItemIcon>
              {notification?.type === NotificationType.INFO && (
                <InfoOutlinedIcon sx={{ color: 'cornflowerblue' }} />
              )}
              {notification?.type === NotificationType.ERROR && (
                <ErrorOutlineIcon color="error" />
              )}
              {notification?.type === NotificationType.SUCCESS && (
                <DoneIcon color="primary" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={notification?.title}
              secondary={notification?.message}
            />
          </ListItem>
        }
      />
    </Snackbar>
  );
}
