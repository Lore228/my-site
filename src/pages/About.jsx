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
    <Box sx={{ px: 2, py: 10, maxWidth: '1400px', mx: 'auto' }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          mb: 1,
          fontFamily: `'Playfair Display', serif`,
          letterSpacing: '1px'
        }}
      >
        Despre mine
      </Typography>

      <Divider
        sx={{
          width: 80,
          height: 3,
          mx: 'auto',
          backgroundColor: 'goldenrod',
          mb: 10
        }}
      />

      {sections.map((section, idx) => (
        <Box
          key={idx}
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{
            display: 'flex',
            flexDirection: {
              xs: 'column',
              md: idx % 2 === 0 ? 'row' : 'row-reverse'
            },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 6, md: 10 },
            mb: 12
          }}
        >
          {/* Imaginea */}
          <Box
            component="img"
            src={section.img}
            alt={section.title}
            sx={{
              width: '100%',
              maxWidth: '500px',
              boxShadow: 3,
              flex: 1,
              mx: 'auto'
            }}
          />

          {/* Textul */}
          <Box sx={{ flex: 1, maxWidth: '500px' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 2,
                fontFamily: `'Playfair Display', serif`,
                color: 'text.primary'
              }}
            >
              {section.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.9,
                fontSize: '1.15rem'
              }}
            >
              {section.text}
            </Typography>

            <Box
              sx={{
                height: '3px',
                width: '80px',
                mt: 3,
                backgroundColor: '#a855f7'
              }}
            />
          </Box>
        </Box>
      ))}

      {/* Buton și semnătură */}
      <Box sx={{ textAlign: 'center', mt: 10 }}>
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
            mt: 5,
            color: '#a855f7',
            fontSize: '2rem'
          }}
        >
          Lorena
        </Typography>
      </Box>
    </Box>
  );
}
