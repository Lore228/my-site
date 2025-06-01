import {
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PortfolioStrip from '../components/PortfolioStrip';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { BookingDialogContext } from '../context/BookingDialogContext';

const services = [
  {
    icon: <FaceRetouchingNaturalIcon fontSize="large" />,
    title: 'Machiaj de zi',
    description: 'Un look proaspăt, natural, potrivit pentru orice moment din zi.',
    price: '150 lei',
  },
  {
    icon: <CameraAltIcon fontSize="large" />,
    title: 'Machiaj pentru ședință foto',
    description: 'Machiaj profesional care scoate în evidență trăsăturile în fotografie.',
    price: '200 lei',
  },
  {
    icon: <FavoriteIcon fontSize="large" />,
    title: 'Machiaj de ocazie',
    description: 'Ideal pentru evenimente speciale – petreceri, botezuri, aniversări.',
    price: '220 lei',
  },
  {
    icon: <EmojiEventsIcon fontSize="large" />,
    title: 'Machiaj mireasă',
    description: 'Look deosebit pentru ziua cea mare, rezistent și personalizat.',
    price: '350 lei',
  },
];

function Services() {
  const { openDialog } = useContext(BookingDialogContext);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', color: theme.palette.text.primary }}>
      <Box sx={{ backgroundColor: theme.palette.background.default, py: 8 }}>
        <Box sx={{ textAlign: 'center', px: 2, mb: 6 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, mb: 2 }}>
            Servicii oferite
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontStyle: 'italic', maxWidth: 600, mx: 'auto', color: isDark ? '#ccc' : '#555' }}
          >
            Machiajul este mai mult decât estetică – este încredere. Alege serviciul potrivit ție.
          </Typography>
        </Box>
        <PortfolioStrip />
      </Box>

      <Box sx={{ backgroundColor: theme.palette.background.default, py: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {services.map((service, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: '#fafafa',
              px: { xs: 3, md: 8 },
              py: 4,
              borderTop: '1px solid #D4AF37',
              borderBottom: '1px solid #D4AF37',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              textAlign: { xs: 'center', md: 'left' },
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#E1D1BB',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ color: '#6A0DAD' }}>{service.icon}</Box>
              <Box>
                <Typography variant="h6" sx={{ fontFamily: 'Playfair Display', fontWeight: 600, color: '#000', mb: 1 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#555', maxWidth: 500 }}>
                  {service.description}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#D4AF37', mb: 1 }}>
                {service.price}
              </Typography>
              <Button
                variant="contained"
                onClick={() => openDialog(service.title)}
                sx={{
                  backgroundColor: '#D4AF37',
                  color: '#000',
                  fontWeight: 600,
                  px: 4,
                  py: 1,
                  borderRadius: 20,
                  '&:hover': {
                    backgroundColor: '#b1902e',
                  },
                }}
              >
                Programează-te
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Services;
