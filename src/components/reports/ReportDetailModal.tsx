import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Grid,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { MedicalReport } from '../../types/report';
import BiomarkerChipGrid from './BiomarkerChipGrid';

interface ReportDetailModalProps {
  report: MedicalReport | null;
  open: boolean;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onOpenAIChat?: (report: MedicalReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  open,
  onClose,
  onDelete,
  onOpenAIChat,
}) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!report) return null;

  const getRiskChip = (risk: 'Low' | 'Moderate' | 'High') => {
    switch (risk) {
      case 'Low':
        return <Chip label="LOW CLINICAL RISK" color="success" sx={{ fontWeight: 800 }} />;
      case 'Moderate':
        return <Chip label="MODERATE RISK" color="warning" sx={{ fontWeight: 800 }} />;
      case 'High':
        return <Chip label="HIGH RISK ALERT" color="error" sx={{ fontWeight: 800 }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: isDark ? '#0F172A' : '#FFFFFF',
          backgroundImage: 'none',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: 'rgba(13, 148, 136, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DescriptionOutlinedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {report.fileName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Report ID: {report.id}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 3 }}>
        {/* Lab Metadata & Risk Header */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <LocalHospitalOutlinedIcon fontSize="small" /> Diagnostic Laboratory
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {report.labName}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <EventOutlinedIcon fontSize="small" /> Collection Date
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {report.reportDate}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ p: 2, borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Clinical Risk Evaluation
              </Typography>
              {getRiskChip(report.overallRisk)}
            </Box>
          </Grid>
        </Grid>

        {/* View Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabIndex} onChange={(_, newVal) => setTabIndex(newVal)}>
            <Tab label={`Biomarkers (${report.biomarkers?.length || 0})`} sx={{ fontWeight: 700 }} />
            <Tab label="Clinical Notes" sx={{ fontWeight: 700 }} />
            <Tab label="Raw Parsed PDF Text" sx={{ fontWeight: 700 }} />
          </Tabs>
        </Box>

        {/* Tab 0: Biomarkers Grid */}
        {tabIndex === 0 && <BiomarkerChipGrid biomarkers={report.biomarkers} />}

        {/* Tab 1: Clinical Notes */}
        {tabIndex === 1 && (
          <Box sx={{ p: 3, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
              Automated Diagnostic Impressions
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
              {report.notes || 'No custom notes provided for this report.'}
            </Typography>
          </Box>
        )}

        {/* Tab 2: Raw Text */}
        {tabIndex === 2 && (
          <Box
            component="pre"
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: isDark ? '#060B18' : '#F1F5F9',
              color: 'text.primary',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              overflowX: 'auto',
              maxHeight: 350,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {report.rawText}
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Button
          color="error"
          onClick={() => {
            if (onDelete) onDelete(report.id);
            onClose();
          }}
          startIcon={<DeleteOutlineIcon />}
          sx={{ fontWeight: 700 }}
        >
          Delete Report
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {onOpenAIChat && (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                onClose();
                onOpenAIChat(report);
              }}
              startIcon={<AutoAwesomeIcon />}
              sx={{ fontWeight: 700 }}
            >
              Ask AI Assistant
            </Button>
          )}

          <Button variant="outlined" onClick={onClose} sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailModal;
