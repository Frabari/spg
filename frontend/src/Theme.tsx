import { createTheme } from '@mui/material/styles';

export const themeOptions = createTheme({
  palette: {
    primary: {
      main: '#5dd886',
    },
    secondary: {
      main: '#ffffff',
    },
    info: {
      main: '#737373',
    },
  },
  typography: {
    fontFamily: ['DM Sans', '-apple-system', 'Arial'].join(','),
    h6: {
      color: '#757575',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'secondary',
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: 50,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'primary',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderRadius: '30px',
        },
        contained: {
          color: 'white',
          boxShadow: 'none',
        },
      },
    },
    MuiBadge: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'info',
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          paddingBottom: '16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
