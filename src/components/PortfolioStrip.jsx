import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const images = [
  '/portofoliu1.jpg',
  '/portofoliu2.jpg',
  '/portofoliu3.jpg',
  '/portofoliu4.jpg',
  '/portofoliu5.jpg',
  '/portofoliu6.jpg',
];

function PortfolioStrip() {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        py: 6,
        backgroundColor: 'transparent',
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: 'linear',
        }}
        style={{
          display: 'flex',
          gap: '2rem',
          width: 'fit-content',
        }}
      >
        {[...images, ...images].map((src, index) => (
          <Box
            key={index}
            component="img"
            src={src}
            alt={`portofoliu-${index}`}
            sx={{
              height: { xs: 160, md: 220 },
              borderRadius: 2,
              objectFit: 'cover',
              boxShadow: 3,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
}

export default PortfolioStrip;
