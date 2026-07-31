import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading HealthOS AI...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '1px solid rgba(13, 148, 136, 0.4)',
            mb: 3,
          }}
        >
          <HealthAndSafetyIcon sx={{ fontSize: 42, color: 'primary.main' }} />
        </Box>
      </motion.div>
      <CircularProgress size={32} thickness={4} sx={{ color: 'primary.main', mb: 2 }} />
      <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.85 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
