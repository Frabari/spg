import { LinearProgress } from '@mui/material';
import { usePendingState } from '../hooks/usePendingState';

export const CustomLinearProgress = () => {
  const { showLoadingIndicator } = usePendingState();

  return (
    showLoadingIndicator && (
      <LinearProgress
        sx={{ position: 'fixed', width: '100%', top: 0, zIndex: 11000 }}
      />
    )
  );
};
