import { Box, IconButton, Typography, Stack, Link, Divider, useTheme } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import SvgIcon from '@mui/material/SvgIcon';

function TikTokIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M12.5,2c1.7,0,3,1.3,3,3c0,1.4,1.1,2.5,2.5,2.5h1v2h-1c-1.6,0-3-0.9-3.8-2.2V14c0,3-2.5,5.5-5.5,5.5S3.5,17,3.5,14
        s2.5-5.5,5.5-5.5h1v2h-1C7.6,10.5,6,12.1,6,14s1.6,3.5,3.5,3.5S13,15.9,13,14V2h-0.5z"/>
    </SvgIcon>
  );
}

function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component="footer"
      sx={{
        px: 4,
        py: 4,
        mt: 8,
        backgroundColor: isDark ? '#121212' : '#f4f4f4',
        borderTop: `1px solid ${isDark ? '#333' : '#ccc'}`,
        textAlign: 'center',
      }}
    >
      {/* Iconițe sociale */}
      <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
        <IconButton
          component="a"
          href="https://www.instagram.com/lore_4552"
          target="_blank"
          rel="noopener"
          sx={{ color: isDark ? '#f0f0f0' : '#6A0DAD' }}
        >
          <InstagramIcon fontSize="medium" />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.tiktok.com/@_lore_mua"
          target="_blank"
          rel="noopener"
          sx={{ color: isDark ? '#f0f0f0' : '#6A0DAD' }}
        >
          <TikTokIcon fontSize="medium" />
        </IconButton>
      </Stack>

      {/* Divider și linkuri cerință facultate */}
      <Divider sx={{ maxWidth: 400, mx: 'auto', my: 2, borderColor: isDark ? '#444' : '#bbb' }} />

      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        Linkuri recomandate:
      </Typography>
      <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap" mb={2}>
        <Link
          href="https://scanstart.ro"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ color: isDark ? '#D4AF37' : '#6A0DAD', fontSize: 14 }}
        >
          scanstart.ro
        </Link>
        <Link
          href="https://csac.ro"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ color: isDark ? '#D4AF37' : '#6A0DAD', fontSize: 14 }}
        >
          csac.ro
        </Link>
        <Link
          href="https://www.instagram.com/cie.engineering_ulbs/?hl=en"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ color: isDark ? '#D4AF37' : '#6A0DAD', fontSize: 14 }}
        >
          CIE Engineering ULBS
        </Link>
      </Stack>

      {/* Footer final text */}
      <Typography variant="caption" sx={{ color: isDark ? '#aaa' : '#555' }}>
        &copy; {new Date().getFullYear()} Allure by Lorena Frățilă. Toate drepturile rezervate.
      </Typography>
    </Box>
  );
}

export default Footer;
