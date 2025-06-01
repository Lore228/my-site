import { Box, Typography, Divider, Grid, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: "Despre mine",
    text: "Sunt make-up artist pasionată, cu un ochi fin pentru detalii și o afinitate pentru frumusețea naturală. Îmi place să ofer încredere și eleganță prin machiaj, adaptându-mă mereu stilului și personalității fiecărei cliente.",
    img: "/about/despre1.jpg"
  },
  {
    title: "Experiență & Colaborări",
    text: "Am avut ocazia să colaborez în cadrul unor evenimente de modă, ședințe foto profesionale și proiecte speciale. Fiecare experiență m-a ajutat să evoluez și să aduc plus valoare serviciilor mele.",
    img: "/about/despre2.jpg"
  },
  {
    title: "Viziune & Valori",
    text: "Cred în frumusețea autentică și în machiajul care evidențiază trăsăturile naturale. Profesionalismul, eleganța și respectul față de clientă sunt fundamentele activității mele.",
    img: "/about/despre3.jpg"
  }
];

export default function About() {
  return (
    <Box sx={{ px: 3, py: 6, maxWidth: '1300px', mx: 'auto' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
        Despre mine
      </Typography>

      <Divider sx={{ width: 60, height: 3, mx: 'auto', backgroundColor: 'gold', mb: 6 }} />

      {sections.map((section, idx) => (
        <Grid
          key={idx}
          container
          spacing={4}
          alignItems="center"
          sx={{
            flexDirection: {
              xs: 'column',
              md: idx % 2 === 0 ? 'row' : 'row-reverse'
            },
            mb: 8
          }}
        >
          <Grid item xs={12} md={6}>
            <motion.img
              src={section.img}
              alt={section.title}
              style={{
                width: '100%',
                height: '350px',
                objectFit: 'cover',
                boxShadow: '0 0 0 transparent',
                transition: 'all 0.4s ease-in-out',
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: '0 0 20px 4px rgba(168, 85, 247, 0.6)' // mov elegant
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                {section.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  maxWidth: '500px',
                  mx: { md: 0, xs: 'auto' },
                  mb: 3
                }}
              >
                {section.text}
              </Typography>

              {/* Linie mov fixă, cu animare spre dreapta */}
              <motion.div
                initial={{ scaleX: 1 }}
                whileHover={{ scaleX: 1.5 }}
                transition={{ duration: 0.4 }}
                style={{
                  height: '5px',
                  width: '150px',
                  transformOrigin: 'left',
                  backgroundColor: '#a855f7',
                  borderRadius: '2px',
                  marginLeft: 0,
                  marginRight: 'auto'
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      ))}

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Button
          variant="outlined"
          component={Link}
          to="/portofoliu#top"
          sx={{
            borderColor: 'goldenrod',
            color: 'goldenrod',
            fontWeight: 'bold',
            px: 4,
            py: 1.2,
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: 'goldenrod',
              color: '#fff',
              borderColor: 'goldenrod'
            }
          }}
        >
          Vezi portofoliul
        </Button>

        <Typography
          variant="h5"
          sx={{
            fontFamily: `'Great Vibes', cursive`,
            mt: 4,
            color: '#a855f7'
          }}
        >
          Lorena
        </Typography>
      </Box>
    </Box>
  );
}
