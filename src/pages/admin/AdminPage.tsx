import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import GlassCard from '../../components/common/GlassCard';

export const AdminPage: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const mockUsers = [
    { id: 'u1', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@hospital.org', role: 'admin', status: 'active', joined: '2026-06-12' },
    { id: 'u2', name: 'Alex Mercer', email: 'alex.mercer@gmail.com', role: 'patient', status: 'active', joined: '2026-07-01' },
    { id: 'u3', name: 'Emily Watson', email: 'emily.watson@health.net', role: 'doctor', status: 'active', joined: '2026-07-15' },
    { id: 'u4', name: 'David Miller', email: 'david.m@company.com', role: 'patient', status: 'active', joined: '2026-07-22' },
  ];

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <AdminPanelSettingsIcon sx={{ color: 'primary.main', fontSize: 36 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Admin Control Panel
          </Typography>
          <Chip label="Platform Superuser" color="primary" sx={{ fontWeight: 800 }} />
        </Box>
        <Typography variant="body1" color="text.secondary">
          Monitor platform metrics, user access roles, Zoho Catalyst backend health, and Gemini AI API usage.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(13, 148, 136, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PeopleOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>142</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Active Users</Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DescriptionOutlinedIcon sx={{ color: 'secondary.main', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>528</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Reports Ingested</Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StorageOutlinedIcon sx={{ color: '#10B981', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>2.4 GB</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Catalyst File Store</Typography>
            </Box>
          </GlassCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <GlassCard sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeIcon sx={{ color: '#F59E0B', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>1,840</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Gemini AI Calls</Typography>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      {/* User Management Table */}
      <GlassCard sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          User Accounts & Role Permissions
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Joined Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 34, height: 34, fontSize: '0.85rem', fontWeight: 700 }}>
                        {u.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {u.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role.toUpperCase()}
                      size="small"
                      color={u.role === 'admin' ? 'primary' : u.role === 'doctor' ? 'secondary' : 'default'}
                      sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label="ACTIVE" size="small" color="success" sx={{ fontWeight: 700, fontSize: '0.68rem' }} />
                  </TableCell>
                  <TableCell>{u.joined}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Role">
                      <IconButton size="small"><EditOutlinedIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Block User">
                      <IconButton size="small" color="error"><BlockOutlinedIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>
    </Box>
  );
};

export default AdminPage;
