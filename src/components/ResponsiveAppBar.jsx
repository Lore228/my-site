import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Switch,
    useMediaQuery,
  } from '@mui/material';
  import { Link } from 'react-router-dom';
  import MenuIcon from '@mui/icons-material/Menu';
  import { useState } from 'react';
  import { useTheme } from '@mui/material/styles';
  import CloseIcon from '@mui/icons-material/Close';

  
  function ResponsiveAppBar({ toggleMode, mode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
    const navItems = [
      { label: 'Acasă', path: '/' },
      { label: 'Servicii', path: '/servicii' },
      { label: 'Portofoliu', path: '/portofoliu' },
      { label: 'Despre', path: '/despre' },
      { label: 'Contact', path: '/contact' },
      { label: 'Calendar', path: '/calendar' },
    ];
  
    const drawer = (
        <Box sx={{ width: 250 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem button component={Link} to={item.path} key={item.label} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      );
      
  
    return (
      <>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(106, 13, 173, 0.85)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar>
            <img
              src="/logo.png"
              alt="Allure Logo"
              style={{ height: 70, marginRight: 12 }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Allure
            </Typography>
            {isMobile ? (
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            ) : (
              <>
                {navItems.map((item) => (
                  <Button key={item.label} color="inherit" component={Link} to={item.path}>
                    {item.label}
                  </Button>
                ))}
                <Switch checked={mode === 'dark'} onChange={toggleMode} />
              </>
            )}
          </Toolbar>
        </AppBar>
  
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {drawer}
        </Drawer>
      </>
    );
  }
  
  export default ResponsiveAppBar;
  