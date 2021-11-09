import { createTheme } from '@material-ui/core/styles'

export const themeOptions = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#5DD886',
    },
    secondary: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: 'DM Sans',
    h6: {
      color: '#757575'
    }
  },
  props: {
    MuiButton: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  overrides: {
    MuiButton: {
        root:{
            borderRadius: '30',
        }
    },
  },
})