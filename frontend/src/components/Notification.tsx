import React, { useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNotifications } from '../hooks/useNotifications';

export default function Notifications() {
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const { notifications } = useNotifications(notification => {
    console.log(notification);
    setNotification(notification);
    setOpen(true);
  });

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      onClose={handleClose}
      autoHideDuration={6000}
      open={open}
      message={notification?.title}
    >
      <Alert
        onClose={handleClose}
        severity={notification?.type}
        sx={{ width: '100%' }}
      >
        {notification?.title}
      </Alert>
    </Snackbar>
  );
}
