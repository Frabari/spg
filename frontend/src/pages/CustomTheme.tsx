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
    fontFamily: 'DM Sans',
    h6: {
      color: '#757575',
    },
  },
  components: {
    MuiAppBar: {
      defaultProps:{
        color: "secondary",
      },
    },
    MuiTabs: {
      styleOverrides:{
        root:{
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding:50,
        },
      },
    },
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
    MuiBadge: {
      defaultProps:{
        color: "primary",
      },
    },
    MuiIconButton: {
      defaultProps:{
        color: "info",
      },
    },
  },
});