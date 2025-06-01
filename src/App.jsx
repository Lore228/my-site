import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
} from '@mui/material';
import { Routes, Route, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Switch } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Home from './pages/Home';
import Services from './pages/Services.jsx';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import { BookingDialogProvider } from './context/BookingDialogContext';
import BookingDialog from './components/BookingDialog';
import CalendarPage from './pages/CalendarPage';


function App() {

  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#6A0DAD' },
          secondary: { main: '#FFD700' },
          background: {
            default: mode === 'light' ? '#bfbfbf' : '#121212',
            paper: mode === 'light' ? '#f4f4f4' : '#1e1e1e',
          },
          text: {
            primary: mode === 'light' ? '#000000' : '#f0f0f0',
          },
        },
        typography: {
          fontFamily: `'Playfair Display', 'Roboto', sans-serif`,
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
      <BookingDialogProvider>
        <CssBaseline />
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(106, 13, 173, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar>
            <img
              src="/logo.png"
              alt="Allure Logo"
              style={{ height: 100, marginRight: 12, marginTop: -8, marginBottom: -8 }}
            />

            <Button color="inherit" component={Link} to="/">
              Acasă
            </Button>
            <Button color="inherit" component={Link} to="/servicii">
              Servicii
            </Button>
            <Button color="inherit" component={Link} to="/portofoliu">
              Portofoliu
            </Button>
            <Button color="inherit" component={Link} to="/despre">
              Despre
            </Button>
            <Button color="inherit" component={Link} to="/contact">
              Contact
            </Button>
            <Switch checked={mode === 'dark'} onChange={toggleMode} />
          </Toolbar>
        </AppBar>
        <Container sx={{ marginTop: 4 }} maxWidth={false}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicii" element={<Services />} />
            <Route path="/portofoliu" element={<Portfolio />} />
            <Route path="/despre" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/despre" element={<About />} />

          </Routes>
        </Container>
        <Footer />
        <BookingDialog />
        </BookingDialogProvider>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
