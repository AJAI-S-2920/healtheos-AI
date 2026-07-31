import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';

interface PlaceholderPageProps {
  title: string;
  description: string;
  badgeText?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, badgeText = 'Coming in Phase 2' }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <GlassCard sx={{ p: 5, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
        <AutoAwesomeIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          {title}
        </Typography>
        <Chip label={badgeText} color="primary" sx={{ fontWeight: 700, mb: 3 }} />
        <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
          {description}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2, fontWeight: 700 }}
        >
          Back to Dashboard
        </Button>
      </GlassCard>
    </Box>
  );
};

export default PlaceholderPage;
