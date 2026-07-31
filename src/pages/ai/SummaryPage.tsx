import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Alert,
  useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import reportsService from '../../services/reportsService';
import geminiService, { AISummaryResult } from '../../services/geminiService';
import { MedicalReport } from '../../types/report';

export const SummaryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(null);
  const [summary, setSummary] = useState<AISummaryResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const data = await reportsService.getReports(currentUser?.uid);
      setReports(data);
      if (data.length > 0) {
        setSelectedReportId(data[0].id);
        setActiveReport(data[0]);
        generateAISummary(data[0]);
      }
    }
    load();
  }, [currentUser]);

  const handleReportChange = (id: string) => {
    setSelectedReportId(id);
    const rep = reports.find((r) => r.id === id) || null;
    setActiveReport(rep);
    if (rep) generateAISummary(rep);
  };

  const generateAISummary = async (report: MedicalReport) => {
    setLoading(true);
    setSummary(null);
    try {
      const res = await geminiService.generateSummary(report);
      setSummary(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!summary) return;
    const text = `HEALTHOS AI CLINICAL SUMMARY\nReport: ${activeReport?.fileName}\n\nOverview:\n${summary.overview}\n\nKey Findings:\n${summary.keyFindings.join('\n')}\n\nDoctor Questions:\n${summary.doctorQuestions.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header & Selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <AutoAwesomeIcon sx={{ color: '#6366F1', fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              AI Health Summary
            </Typography>
            <Chip label="Google Gemini AI" color="secondary" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
          </Box>
          <Typography variant="body1" color="text.secondary">
            Automated medical report synthesis, biomarker anomaly detection, and doctor discussion points.
          </Typography>
        </Box>

        <Box sx={{ minWidth: 260 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="report-select-label">Select Medical Report</InputLabel>
            <Select
              labelId="report-select-label"
              value={selectedReportId}
              label="Select Medical Report"
              onChange={(e) => handleReportChange(e.target.value)}
            >
              {reports.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.fileName} ({r.reportDate})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main Content Area */}
      {loading ? (
        <GlassCard sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={40} sx={{ mb: 2, color: 'secondary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Generating Clinical AI Summary...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Analyzing lab report text, biomarker reference intervals, and medical risk factors with Google Gemini API.
          </Typography>
        </GlassCard>
      ) : summary && activeReport ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Executive Overview Banner */}
          <GlassCard
            sx={{
              p: 4,
              mb: 4,
              background: isDark
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(13, 148, 136, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(13, 148, 136, 0.05) 100%)',
              border: `1px solid ${isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.2)'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DescriptionOutlinedIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Executive Clinical Overview
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lab: {activeReport.labName} | Date: {activeReport.reportDate}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={handleCopySummary}
                startIcon={copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
                sx={{ fontWeight: 700 }}
              >
                {copied ? 'Copied to Clipboard' : 'Copy Summary'}
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
              {summary.overview}
            </Typography>
          </GlassCard>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Risk Alerts */}
            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <WarningAmberIcon sx={{ color: '#EF4444' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Clinical Risk Warnings
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {summary.riskAlerts.map((alert, idx) => (
                  <Alert severity="warning" key={idx} sx={{ mb: 1.5, borderRadius: 2, fontWeight: 600 }}>
                    {alert}
                  </Alert>
                ))}
              </GlassCard>
            </Grid>

            {/* Key Biomarker Findings */}
            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MedicalServicesOutlinedIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Key Biomarker Insights
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {summary.keyFindings.map((finding, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {finding}
                    </Typography>
                  </Box>
                ))}
              </GlassCard>
            </Grid>
          </Grid>

          {/* Doctor Discussion Questions & Lifestyle Actions */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <HelpOutlineIcon sx={{ color: '#F59E0B' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Questions for Your Doctor
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {summary.doctorQuestions.map((q, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2.5,
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      borderLeft: '4px solid #F59E0B',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      "{q}"
                    </Typography>
                  </Paper>
                ))}
              </GlassCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AutoAwesomeIcon sx={{ color: '#10B981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Evidence-Based Action Items
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                {summary.recommendations.map((rec, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: 2.5,
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      borderLeft: '4px solid #10B981',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.5 }}>
                      {rec}
                    </Typography>
                  </Paper>
                ))}
              </GlassCard>
            </Grid>
          </Grid>
        </motion.div>
      ) : (
        <GlassCard sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6">No Medical Reports Available</Typography>
          <Button variant="contained" onClick={() => navigate('/upload')} sx={{ mt: 2, fontWeight: 700 }}>
            Upload Medical Report
          </Button>
        </GlassCard>
      )}
    </Box>
  );
};

export default SummaryPage;
