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
    useMediaQuery
  } from '@mui/material';
  import MenuIcon from '@mui/icons-material/Menu';
  import CloseIcon from '@mui/icons-material/Close';
  import { Link } from 'react-router-dom';
  import { useState } from 'react';
  import { useTheme } from '@mui/material/styles';
  
  export default function ResponsiveAppBar({ toggleMode, mode }) {
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
      <Box
        sx={{
          width: 250,
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // fundal semi-transparent
          backdropFilter: 'blur(6px)',
        }}
        role="presentation"
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              component={Link}
              to={item.path}
              key={item.label}
              onClick={() => setDrawerOpen(false)}
            >
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
              navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  to={item.path}
                >
                  {item.label}
                </Button>
              ))
            )}
          </Toolbar>
        </AppBar>
  
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
          ModalProps={{
            BackdropProps: {
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.4)' }, // fundal întunecat în spate
            },
          }}
        >
          {drawer}
        </Drawer>
      </>
    );
  }
  