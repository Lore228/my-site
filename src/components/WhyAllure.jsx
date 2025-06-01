import { Box, Typography, Grid } from '@mui/material';
import { Star, Favorite, AccessTime, EmojiEvents } from '@mui/icons-material';
import { motion } from 'framer-motion';

const items = [
    {
      icon: <Star fontSize="large" />,
      title: 'Machiaj personalizat',
      text: 'Fiecare clientă primește un look adaptat trăsăturilor ei.',
    },
    {
      icon: <Favorite fontSize="large" />,
      title: 'Atmosferă relaxantă',
      text: 'Îmi place să creez o experiență caldă și calmă.',
    },
    {
      icon: <AccessTime fontSize="large" />,
      title: 'Fără grabă',
      text: 'Mă dedic fiecărei cliente, fără presiunea timpului.',
    },
    {
      icon: <EmojiEvents fontSize="large" />,
      title: 'Pasiune, nu doar meserie',
      text: 'Machiajul este felul meu de a spune povești vizuale.',
    },
  ];
  

function WhyAllure() {
  return (
    <Box
      id="why-allure"
      sx={{
        py: 10,
        px: 2,
         
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontFamily: 'Playfair Display',
            fontWeight: 600,
            mb: 6,
            color: '#333',
          }}
        >
          De ce Allure?
        </Typography>
      </motion.div>

      <Grid container spacing={4} justifyContent="center">
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  textAlign: 'center',
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: '#D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  {item.text}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default WhyAllure;
