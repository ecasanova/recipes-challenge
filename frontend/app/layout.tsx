'use client';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import StickyFooter from '../components/footer';
import ResponsiveAppBar from '../components/header';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <ThemeProvider theme={darkTheme}>
          <ResponsiveAppBar />
          <CssBaseline />
          <Container component="main" sx={{ mt: 0, mb: 2 }} maxWidth="mb">
            {children}
          </Container>
          <StickyFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
