import { createTheme } from '@mui/material/styles';

export const themeOptions = createTheme({
  palette: {
    primary: {
      main: '#5dd886',
    },
    secondary: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: 'DM Sans',
    h6: {
      color: '#757575',
    },
  },
  components: {
    MuiButton: {
      defaultProps:{
        color: "primary",
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          borderRadius: '30px'
        }
      },
    },
  },
});
