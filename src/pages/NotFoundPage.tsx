import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <HealthAndSafetyIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.8 }} />
        <Typography variant="h1" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '4rem', sm: '6rem' } }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The clinical resource or path you requested does not exist or has been relocated within HealthOS AI.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/dashboard')}
          startIcon={<HomeIcon />}
          sx={{ py: 1.5, px: 4, fontWeight: 700 }}
        >
          Return to Dashboard
        </Button>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
