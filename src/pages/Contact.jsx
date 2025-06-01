import {
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
} from '@mui/material';
import { Instagram, MusicNote } from '@mui/icons-material';
import { useRef, useState, useContext } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { BookingDialogContext } from '../context/BookingDialogContext';

function Contact() {
  const theme = useTheme();
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const { openDialog } = useContext(BookingDialogContext);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .sendForm('service_yywsn3o', 'template_z9mi3p8', form.current, 'E1JjOQH6LiLOO343h')
      .then(() => {
        setLoading(false);
        setSuccessMsg('Mesajul tău a fost trimis cu succes!');
        form.current.reset();
      })
      .catch(() => {
        setLoading(false);
        setSuccessMsg('A apărut o eroare. Încearcă din nou.');
      });
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
      <Box sx={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/background.mp4"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
            filter: 'brightness(0.5)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            color: '#fff',
            px: 2,
          }}
        >
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography variant="h3" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, mb: 2 }}>
              Frumusețea începe cu un gest
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', color: '#ddd' }}>
              Programează-te acum sau trimite-ne un mesaj direct.
            </Typography>
          </motion.div>
        </Box>
      </Box>

      <Box sx={{ py: 10, px: { xs: 2, md: 6 } }}>
        {successMsg && (
          <Alert severity="success" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            {successMsg}
          </Alert>
        )}

        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, color: '#D4AF37', mb: 1 }}>
              Locația noastră
            </Typography>
            <Box sx={{ width: 120, height: 2, backgroundColor: '#D4AF37', mb: 3 }} />
            <Typography variant="body2" sx={{ mb: 2 }}>📍 Strada Doinei nr. 12, Cugir, Alba</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>📞 +40 742 244 991</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>📧 contact@allurebeauty.ro</Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
              <IconButton href="https://www.instagram.com/lore_4552" target="_blank" sx={{ backgroundColor: '#6A0DAD', color: '#fff' }}>
                <Instagram />
              </IconButton>
              <IconButton href="https://www.tiktok.com/@_lore_mua" target="_blank" sx={{ backgroundColor: '#6A0DAD', color: '#fff' }}>
                <MusicNote />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              onClick={() => openDialog('Programare generală')}
              sx={{
                mt: 4,
                backgroundColor: '#D4AF37',
                color: '#000',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: '999px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#b1902e',
                },
              }}
            >
              Programează-te
            </Button>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, color: '#D4AF37' }}>
                Trimite-ne un mesaj
              </Typography>
              <Box component="form" ref={form} onSubmit={sendEmail}>
                <TextField fullWidth name="user_name" label="Numele tău" required sx={{ mb: 3 }} />
                <TextField fullWidth name="user_email" label="Email" type="email" required sx={{ mb: 3 }} />
                <TextField fullWidth name="message" label="Mesajul tău" multiline rows={4} required sx={{ mb: 3 }} />
                <Button type="submit" variant="contained" disabled={loading} sx={{ backgroundColor: '#6A0DAD' }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Trimite mesajul'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Secțiunea cu harta */}
      <Box sx={{ width: '100%', height: { xs: 300, md: 400 }, mt: 4 }}>
        <iframe
          title="Harta Salon Allure Beauty"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2826.521865347774!2d23.480319315515343!3d45.83799217910833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4748dc95a8e7df9f%3A0x9e4cae6a524c6a29!2sStrada%20Doinei%2012%2C%20Cugir%2C%20Alba%2C%20Romania!5e0!3m2!1sen!2sus!4v1682600000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  );
}

export default Contact;
