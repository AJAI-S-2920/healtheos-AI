import React from 'react';
import {
  Grid,
  Box,
  Typography,
  Chip,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Biomarker } from '../../types/report';

interface BiomarkerChipGridProps {
  biomarkers: Biomarker[];
}

export const BiomarkerChipGrid: React.FC<BiomarkerChipGridProps> = ({ biomarkers }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!biomarkers || biomarkers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        No biomarkers detected in report.
      </Typography>
    );
  }

  const getStatusIcon = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal':
        return <CheckCircleOutlineIcon sx={{ fontSize: '1.1rem', color: '#10B981' }} />;
      case 'warning':
        return <WarningAmberIcon sx={{ fontSize: '1.1rem', color: '#F59E0B' }} />;
      case 'critical':
        return <ErrorOutlineIcon sx={{ fontSize: '1.1rem', color: '#EF4444' }} />;
    }
  };

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'normal':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', text: '#10B981' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', text: '#F59E0B' };
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.3)', text: '#EF4444' };
    }
  };

  return (
    <Grid container spacing={2.5}>
      {biomarkers.map((b) => {
        const colors = getStatusColor(b.status);
        return (
          <Grid item xs={12} sm={6} md={4} key={b.id}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: isDark ? 'rgba(17, 28, 56, 0.6)' : 'rgba(248, 250, 252, 0.8)',
                border: `1px solid ${colors.border}`,
                boxShadow: `0 4px 12px ${colors.bg}`,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Chip
                  label={b.category}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getStatusIcon(b.status)}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, color: colors.text, textTransform: 'uppercase' }}
                  >
                    {b.status}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.3 }}>
                {b.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: colors.text }}>
                  {b.value}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {b.unit}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Ref Range: <strong>{b.referenceRange}</strong>
                </Typography>

                {b.description && (
                  <Tooltip title={b.description} arrow placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'pointer' }} />
                  </Tooltip>
                )}
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default BiomarkerChipGrid;
