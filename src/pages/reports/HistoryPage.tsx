import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';
import ReportDetailModal from '../../components/reports/ReportDetailModal';
import reportsService from '../../services/reportsService';
import { MedicalReport } from '../../types/report';

export const HistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Moderate' | 'High'>('All');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);

  const loadReports = async () => {
    const data = await reportsService.getReports(currentUser?.uid);
    setReports(data);
  };

  useEffect(() => {
    loadReports();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    await reportsService.deleteReport(id);
    await loadReports();
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.labName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'All' || r.overallRisk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskChip = (risk: 'Low' | 'Moderate' | 'High') => {
    switch (risk) {
      case 'Low':
        return <Chip label="LOW RISK" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'Moderate':
        return <Chip label="MODERATE RISK" color="warning" size="small" sx={{ fontWeight: 700 }} />;
      case 'High':
        return <Chip label="HIGH RISK" color="error" size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Report History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your historical medical reports stored in Zoho Catalyst Data Store & File Store.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/upload')}
          startIcon={<CloudUploadOutlinedIcon />}
          sx={{ py: 1.2, px: 3, fontWeight: 700 }}
        >
          Upload New Report
        </Button>
      </Box>

      {/* Filters & Search */}
      <GlassCard sx={{ p: 2.5, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search reports by file name or lab name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: { md: 'flex-end' }, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Risk Filter:
              </Typography>
              {(['All', 'Low', 'Moderate', 'High'] as const).map((level) => (
                <Chip
                  key={level}
                  label={level}
                  onClick={() => setRiskFilter(level)}
                  color={riskFilter === level ? 'primary' : 'default'}
                  variant={riskFilter === level ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 700, cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </GlassCard>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <GlassCard sx={{ p: 6, textAlign: 'center' }}>
          <DescriptionOutlinedIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No Medical Reports Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || riskFilter !== 'All'
              ? 'No reports match your current filter parameters.'
              : 'Upload your first blood report or lab panel to begin automated AI tracking.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/upload')} startIcon={<CloudUploadOutlinedIcon />} sx={{ fontWeight: 700 }}>
            Upload PDF Report
          </Button>
        </GlassCard>
      ) : (
        <Grid container spacing={3}>
          {filteredReports.map((report) => (
            <Grid item xs={12} md={6} key={report.id}>
              <GlassCard hoverEffect sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: 2.5,
                          bgcolor: 'rgba(13, 148, 136, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <DescriptionOutlinedIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {report.fileName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {report.biomarkers.length} Biomarkers Parsed
                        </Typography>
                      </Box>
                    </Box>

                    {getRiskChip(report.overallRisk)}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocalHospitalOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {report.labName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {report.reportDate}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {report.notes}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setSelectedReport(report)}
                    startIcon={<VisibilityOutlinedIcon />}
                    sx={{ fontWeight: 700 }}
                  >
                    View Details
                  </Button>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Analyze with Gemini AI">
                      <IconButton color="secondary" onClick={() => navigate('/chat')}>
                        <AutoAwesomeIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Report">
                      <IconButton color="error" onClick={() => handleDelete(report.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </GlassCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        open={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        onDelete={handleDelete}
        onOpenAIChat={() => navigate('/chat')}
      />
    </Box>
  );
};

export default HistoryPage;
