import { PropsWithChildren } from 'react';
import { Check, Error } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';

export type EmptyStateProps = PropsWithChildren<{
  type: 'error' | 'success';
  hint: string;
}>;

const iconProps = {
  sx: {
    width: 100,
    height: 100,
    color: 'text.disabled',
    mb: 4,
  },
};

export const EmptyState = ({ type, hint, children }: EmptyStateProps) => (
  <Grid
    container
    alignItems="center"
    justifyContent="center"
    sx={{ p: 8 }}
    direction="column"
  >
    {type === 'error' ? (
      <Error {...iconProps} />
    ) : type === 'success' ? (
      <Check {...iconProps} />
    ) : null}
    <Typography color="text.disabled" fontWeight="bold">
      {hint}
    </Typography>
    {children}
  </Grid>
);
