import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, useTheme, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Rating } from '@mui/material';


const defaultTestimonials = [
  {
    name: 'Andreea',
    message: 'Machiajul a rezistat perfect toată ziua! Lorena are mâini magice.',
  },
  {
    name: 'Bianca',
    message: 'Atmosfera a fost minunată. M-am simțit răsfățată și încrezătoare.',
  },
  {
    name: 'Ioana',
    message: 'Recomand cu drag! Machiajul a fost exact cum mi-am dorit, poate chiar mai frumos.',
  },
];

function Testimonials() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);


  // Încarcă recenziile salvate
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/reviews`)
      .then(res => res.json())
      .then(data => setTestimonials([...defaultTestimonials, ...data]))
      .catch(err => console.error('Eroare la încărcarea recenziilor:', err));
  }, []);
  

  // Trimite recenzie
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTestimonial = { name, message, rating };
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });
  
      const result = await res.json();
      if (result.success) {
        setTestimonials(prev => [...prev, newTestimonial]);
        setName('');
        setMessage('');
        alert('Mulțumim pentru recenzie!');
      } else {
        alert('Eroare la trimiterea recenziei.');
      }
    } catch (err) {
      console.error('Eroare rețea:', err);
      alert('Eroare de rețea.');
    }
  };
  

  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 2, md: 10 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 6,
      }}
    >
      {/* Recenzii */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Playfair Display',
            mb: 4,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          Recenzii de la cliente
        </Typography>
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                mb: 3,
                border: '1px solid #D4AF37',
                backgroundColor: isDark ? '#2b2b2b' : '#fff',
                p: 3,
              }}
            >
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 1 }}>
                “{item.message}”
              </Typography>
              <Rating name="read-only" value={item.rating || 5} readOnly size="small" />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontFamily: 'Playfair Display',
                  color: '#6A0DAD',
                }}
              >
                — {item.name}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Separator */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: 'none', md: 'block' }, borderColor: '#D4AF37' }}
      />

      {/* Formular */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', mb: 4 }}>
          Lasă o recenzie
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Numele tău"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              sx: {
                backgroundColor: isDark ? '#1a1a1a' : '#fff',
              },
            }}
          />
          <TextField
            fullWidth
            label="Mesaj"
            required
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              sx: {
                backgroundColor: isDark ? '#1a1a1a' : '#fff',
              },
            }}
          />
          <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          size="large"
          sx={{ mb: 3 }}
          />
          <Button variant="contained" type="submit" sx={{ backgroundColor: '#6A0DAD' }}>
            Trimite recenzia
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Testimonials;
