import { createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

// Create a theme instance.
export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#7e57c2',
      light: '#b085f5',
      dark: '#4d2c91',
    },
    secondary: {
      main: '#5e35b1',
      light: '#9162e4',
      dark: '#280680',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f3f3f3',
    },
  },
  transitions: {
    create: () => 'none',
  },
})

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#7e57c2',
      light: '#b085f5',
      dark: '#4d2c91',
    },
    secondary: {
      main: '#5e35b1',
      light: '#9162e4',
      dark: '#280680',
    },
    error: {
      main: red.A400,
    },
  },
})
