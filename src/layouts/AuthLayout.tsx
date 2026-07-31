import React from 'react';
import { Box, Container, Typography, Chip, IconButton, Tooltip, useTheme } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { motion } from 'framer-motion';
import { useThemeMode } from '../context/ThemeModeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isDark = mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: isDark ? '#060B18' : '#F1F5F9',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Background Glow Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating Theme Switcher */}
      <Box sx={{ position: 'absolute', top: 20, right: 24, zIndex: 10 }}>
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': { bgcolor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)' },
            }}
          >
            {isDark ? <Brightness7Icon sx={{ color: '#F59E0B' }} /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Container maxWidth="lg" sx={{ my: 'auto', py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: isDark
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
              : '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Left Branding Panel */}
          <Box
            sx={{
              background: isDark
                ? 'linear-gradient(135deg, #0F172A 0%, #0F2D3A 50%, #111C38 100%)'
                : 'linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #4F46E5 100%)',
              color: '#FFFFFF',
              p: { xs: 4, sm: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <HealthAndSafetyIcon sx={{ fontSize: 32, color: '#FFFFFF' }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                    HealthOS AI
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>
                    CLINICAL INTELLIGENCE
                  </Typography>
                </Box>
              </Box>

              <Chip
                icon={<AutoAwesomeIcon sx={{ fontSize: '1rem !important', color: '#F59E0B !important' }} />}
                label="Next-Gen Medical Report Intelligence"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  mb: 3,
                  py: 0.5,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              />

              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
                Transform Medical Reports into Actionable Insights
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 4, lineHeight: 1.6 }}>
                Powered by Google Gemini AI & Zoho Catalyst infrastructure. Instant PDF report ingestion, automated medical summaries, trend tracking, and HIPAA-compliant data security.
              </Typography>
            </motion.div>

            {/* Feature List Badges */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 'auto' }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <ShieldOutlinedIcon sx={{ color: '#10B981', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                  Firebase Protected
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  Enterprise Session Security
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <InsightsIcon sx={{ color: '#818CF8', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                  Biomarker Analytics
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                  Automated Trend Graphing
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Form Panel */}
          <Box
            sx={{
              bgcolor: isDark ? '#111C38' : '#FFFFFF',
              p: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>

              {children}
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
