import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00a2ff", // blue
    },
    secondary: {
      main: "#1d3c61", // dark blue
    },
    background: {
      default: "#f9f9f9", // light gray
      paper: "#ffffff", // white
    },
    text: {
      primary: "#4a4a4a",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#1d3c61",
    },
    body1: {
      fontSize: "1rem",
      color: "#4a4a4a", // Dark text for body
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Rounded buttons
          textTransform: "none", // Preserve button text case
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1d3c61",
        },
      },
    },
  },
});

export default theme;
