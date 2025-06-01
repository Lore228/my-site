import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { BookingDialogContext } from '../context/BookingDialogContext';
import WhyAllure from '../components/WhyAllure';
import Testimonials from '../components/Testimonials';

function Home() {
  const { openDialog } = useContext(BookingDialogContext);

  return (
    <Box sx={{ backgroundColor: '#bfbfbf', minHeight: '100vh' }}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundImage: "url('/hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: 'white',
          px: { xs: 2, md: 8 },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(0,0,0,0.75), rgba(0,0,0,0.2))',
            zIndex: 1,
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, mb: 1 }}>
              Allure Beauty Studio
            </Typography>
            <Box sx={{ width: 80, height: 3, backgroundColor: '#D4AF37', mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 4 }}>
              Eleganță. Rafinament. Machiaje profesionale pentru femei care inspiră.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => openDialog('Programare generală')}
              sx={{
                backgroundColor: '#6A0DAD',
                mr: 2,
                '&:hover': { backgroundColor: '#520A9E' },
              }}
            >
              Programează-te
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="https://wa.me/40742244991?text=Salut!%20Vreau%20o%20programare"
              target="_blank"
              sx={{
                borderColor: '#D4AF37',
                color: '#D4AF37',
                '&:hover': {
                  borderColor: '#fff',
                  color: '#fff',
                  backgroundColor: '#D4AF3733',
                },
              }}
            >
              WhatsApp
            </Button>
          </motion.div>
        </Box>
      </Box>

      <WhyAllure />
      <Testimonials />
    </Box>
  );
}

export default Home;
