import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import GlassCard from '../../components/common/GlassCard';

export const TrendsPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Historical Biomarker Trend Data
  const glucoseData = [
    { date: 'Jan 2026', glucose: 104, hba1c: 5.8 },
    { date: 'Mar 2026', glucose: 110, hba1c: 6.0 },
    { date: 'May 2026', glucose: 122, hba1c: 6.3 },
    { date: 'Jul 2026', glucose: 118, hba1c: 6.2 },
  ];

  const lipidData = [
    { date: 'Jan 2026', totalChol: 195, ldl: 125, hdl: 42, triglycerides: 155 },
    { date: 'Mar 2026', totalChol: 205, ldl: 132, hdl: 40, triglycerides: 165 },
    { date: 'May 2026', totalChol: 220, ldl: 148, hdl: 36, triglycerides: 185 },
    { date: 'Jul 2026', totalChol: 215, ldl: 142, hdl: 38, triglycerides: 175 },
  ];

  const bloodCountData = [
    { date: 'Jan 2026', hemoglobin: 14.2, wbc: 6.8 },
    { date: 'Mar 2026', hemoglobin: 14.5, wbc: 7.1 },
    { date: 'May 2026', hemoglobin: 14.4, wbc: 7.5 },
    { date: 'Jul 2026', hemoglobin: 14.8, wbc: 7.2 },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <ShowChartOutlinedIcon sx={{ color: '#10B981', fontSize: 36 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Health Trends & Biomarker Analytics
          </Typography>
          <Chip label="Recharts Engine" color="success" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Track longitudinal biomarker fluctuations across multiple clinical test reports over time.
        </Typography>
      </Box>

      {/* Summary KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Fasting Blood Glucose
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                118
              </Typography>
              <Typography variant="caption" color="text.secondary">
                mg/dL
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingDownIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                -4 mg/dL from last report
              </Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              HbA1c Trend (90-Day Avg)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                6.2
              </Typography>
              <Typography variant="caption" color="text.secondary">
                %
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingDownIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                -0.1% improvement
              </Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              LDL Cholesterol (Bad)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444' }}>
                142
              </Typography>
              <Typography variant="caption" color="text.secondary">
                mg/dL
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingDownIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                -6 mg/dL from peak
              </Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
              Hemoglobin (Hb)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, my: 0.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
                14.8
              </Typography>
              <Typography variant="caption" color="text.secondary">
                g/dL
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>
                Optimal reference level
              </Typography>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Chart 1: Fasting Glucose & HbA1c */}
      <GlassCard sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Glycemic Profile Progression (Glucose & HbA1c)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Monitors Fasting Blood Sugar (mg/dL) alongside 3-month Glycated Hemoglobin (%) trends.
        </Typography>
        <Box sx={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={glucoseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
              <XAxis dataKey="date" stroke={isDark ? '#94A3B8' : '#64748B'} />
              <YAxis yAxisId="left" stroke="#0D9488" domain={[80, 140]} />
              <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" domain={[3.5, 7.5]} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderRadius: 12,
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="glucose" name="Fasting Glucose (mg/dL)" stroke="#0D9488" strokeWidth={3} dot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="hba1c" name="HbA1c (%)" stroke="#F59E0B" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </GlassCard>

      {/* Chart 2: Lipid Profile Bar Chart */}
      <GlassCard sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Lipid Sub-Fraction Distribution (Cholesterol & Triglycerides)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Comparison of Total Cholesterol, LDL (Bad), HDL (Good), and Triglycerides over time.
        </Typography>
        <Box sx={{ width: '100%', height: 340 }}>
          <ResponsiveContainer>
            <BarChart data={lipidData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
              <XAxis dataKey="date" stroke={isDark ? '#94A3B8' : '#64748B'} />
              <YAxis stroke={isDark ? '#94A3B8' : '#64748B'} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
                  borderRadius: 12,
                  border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              />
              <Legend />
              <Bar dataKey="totalChol" name="Total Cholesterol" fill="#6366F1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="ldl" name="LDL (Bad)" fill="#EF4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="hdl" name="HDL (Good)" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="triglycerides" name="Triglycerides" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </GlassCard>
    </Box>
  );
};

export default TrendsPage;
