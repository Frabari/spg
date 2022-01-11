import { createTheme } from '@mui/material/styles';

let themeOptions = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
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
    background: {
      default: '#fafafa',
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
    MuiButton: {
      defaultProps: {
        color: 'primary',
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          color: 'white',
          boxShadow: 'none',
          fontWeight: 'bold',
          borderRadius: '30px',
        },
        outlined: {
          borderRadius: '30px',
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
        rounded: 'border-radius: 8px',
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: 'white',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

themeOptions = createTheme(themeOptions, {
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          [themeOptions.breakpoints.down('md')]: {
            width: '500px',
          },
          [themeOptions.breakpoints.up('md')]: {
            width: '640px',
          },
        },
      },
    },
  },
});

export default themeOptions;
