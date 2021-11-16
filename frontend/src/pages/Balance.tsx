import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { User } from '../api/basil-api';
import { useState } from 'react';
import { useTransaction } from '../hooks/useTransaction';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { Add, Remove } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export const Balance = (props: any) => {
  const navigate = useNavigate();
  const { upsertTransaction } = useTransaction();
  const { load } = useUser();
  let [amount, setAmount] = useState(0);
  const handleClose = () => {
    props.setOpen(false);
  };

  const change = (add: boolean) => {
    if (amount > 0) {
      amount = add ? amount : -amount;
      upsertTransaction({
        user: { id: props.user.id } as User,
        amount: amount,
      })
        .then(() => {
          load();
          toast.success(`Wallet updated`);
          navigate(`/admin/users/${props.user?.id}`);
          props.setOpen(false);
        })
        .catch(e => toast.error(e.message));
    } else {
      toast.error(`Amount should be a positive and not null number`);
    }
  };

  return (
    <>
      <Modal open={props.open} onClose={handleClose}>
        <Box sx={style}>
          <Grid
            container
            direction="column"
            spacing="1rem"
            padding="15px"
            justifyContent="center"
            alignItems="center"
          >
            <Typography id="modal-user-name" variant="h6" component="h1">
              {props.user?.name + ' ' + props.user?.surname} Wallet
            </Typography>
            <ThemeProvider
              theme={createTheme({
                components: {
                  MuiTextField: {
                    defaultProps: {
                      fullWidth: true,
                    },
                  },
                },
              })}
            >
              <Grid item>
                <TextField
                  sx={{ mt: 2 }}
                  id="amount"
                  label="Amount"
                  onChange={e => setAmount(+e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"> € </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </ThemeProvider>
            <Grid item>
              <Button
                color="error"
                variant="outlined"
                onClick={() => change(false)}
                sx={{ width: 116, m: 1 }}
              >
                <Remove sx={{ py: '4px' }} />
                Reduce
              </Button>
              <Button
                onClick={() => change(true)}
                variant="outlined"
                sx={{ width: 116, m: 1 }}
              >
                <Add sx={{ py: '4px' }} />
                Top Up
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
