import { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  Box,
  Divider,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { motion } from 'framer-motion';


const allPhotos = Array.from({ length: 10 }, (_, i) =>
  [`portofoliu/model${i + 1}/1.jpg`, `portofoliu/model${i + 1}/2.jpg`, `portofoliu/model${i + 1}/3.jpg`]
).flat();

function Portfolio() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleOpen = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const nextPhoto = () => {
    setPhotoIndex((photoIndex + 1) % allPhotos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((photoIndex - 1 + allPhotos.length) % allPhotos.length);
  };

  return (
    <Box sx={{ textAlign: 'center', px: 3 }}>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
        Portofoliu
      </Typography>

      <Divider sx={{ width: 60, height: 3, mx: 'auto', background: 'gold', mb: 2 }} />

      <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4 }}>
        Descoperă o selecție de machiaje realizate cu pasiune și eleganță.
      </Typography>

      <Grid
  container
  spacing={4}
  justifyContent="center"
  sx={{
    maxWidth: 1200,
    mx: 'auto', // centrează grid-ul pe pagină
  }}
>
  {allPhotos.map((src, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
>
  <Card
    sx={{
      cursor: 'pointer',
      boxShadow: 4,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 0 15px 3px rgba(212, 175, 55, 0.6)' // aurie
      }
    }}
    onClick={() => handleOpen(index)}
  >
    <CardMedia
      component="img"
      image={`/${src}`}
      alt={`Machiaj ${index + 1}`}
      sx={{ height: 450, objectFit: 'cover' }}
    />
  </Card>
</motion.div>

    </Grid>
  ))}
</Grid>


      {lightboxOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.9)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <IconButton
            sx={{ position: 'absolute', top: 20, right: 20, color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>

          <IconButton
            sx={{ position: 'absolute', left: 20, color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <img
            src={`/${allPhotos[photoIndex]}`}
            alt="Preview"
            style={{ maxHeight: '80vh', maxWidth: '90vw', borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />

          <IconButton
            sx={{ position: 'absolute', right: 20, color: 'white' }}
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default Portfolio;
