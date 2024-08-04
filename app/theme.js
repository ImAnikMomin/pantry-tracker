// app/theme.js
"use client";

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#A67C52', // Tan
    },
    secondary: {
      main: '#8B4513', // Brown
    },
    background: {
      default: '#F5F5DC', // Beige
      paper: '#FAF0E6', // Linen
    },
    text: {
      primary: '#5D3A1A', // Dark Brown
      secondary: '#8B4513', // Brown
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;
