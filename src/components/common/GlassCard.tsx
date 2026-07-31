import React from 'react';
import { Paper, PaperProps, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface GlassCardProps extends PaperProps {
  hoverEffect?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  hoverEffect = false,
  children,
  sx,
  ...props
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      style={{ width: '100%' }}
    >
      <Paper
        elevation={0}
        sx={{
          background: isDark
            ? 'rgba(17, 28, 56, 0.75)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(0, 0, 0, 0.06)',
          borderRadius: 4,
          padding: 3,
          transition: 'all 0.3s ease-in-out',
          boxShadow: isDark
            ? '0 10px 30px -10px rgba(0,0,0,0.5)'
            : '0 10px 30px -10px rgba(15,23,42,0.06)',
          '&:hover': hoverEffect
            ? {
                borderColor: theme.palette.primary.main,
                boxShadow: isDark
                  ? '0 14px 40px -10px rgba(13, 148, 136, 0.3)'
                  : '0 14px 40px -10px rgba(13, 148, 136, 0.15)',
              }
            : {},
          ...sx,
        }}
        {...props}
      >
        {children}
      </Paper>
    </motion.div>
  );
};

export default GlassCard;
