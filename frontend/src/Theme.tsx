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
    h4: {
      color: '#757575',
    },
    caption: {
      marginLeft: '5px',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: 'secondary',
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
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
          fontWeight: 'bold',
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
    // MuiPaper: {
    //   styleOverrides: {
    //     rounded: 'border-radius: 8px',
    //   },
    // },
  },
});
