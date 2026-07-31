import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 260;

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useAuth();
  const isDark = theme.palette.mode === 'dark';

  const menuGroups = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon /> },
        { label: 'Upload Reports', path: '/upload', icon: <CloudUploadOutlinedIcon /> },
        { label: 'AI Health Summary', path: '/summary', icon: <AutoAwesomeOutlinedIcon />, badge: 'AI' },
        { label: 'Report History', path: '/history', icon: <HistoryOutlinedIcon /> },
      ],
    },
    {
      title: 'INTELLIGENCE & ANALYTICS',
      items: [
        { label: 'AI Health Chat', path: '/chat', icon: <ChatOutlinedIcon />, badge: 'Gemini' },
        { label: 'Health Trends', path: '/trends', icon: <ShowChartOutlinedIcon /> },
      ],
    },
    {
      title: 'ACCOUNT & SYSTEM',
      items: [
        { label: 'User Profile', path: '/profile', icon: <PersonOutlineIcon /> },
        { label: 'Settings', path: '/settings', icon: <SettingsOutlinedIcon /> },
        ...(currentUser?.role === 'admin'
          ? [{ label: 'Admin Panel', path: '/admin', icon: <AdminPanelSettingsOutlinedIcon />, badge: 'Admin' }]
          : []),
      ],
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDark ? '#0F172A' : '#FFFFFF',
        color: 'text.primary',
        pt: { xs: 2, md: 3 },
        pb: 2,
        px: 2,
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {menuGroups.map((group, gIdx) => (
          <Box key={group.title} sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                px: 1.5,
                mb: 1,
                display: 'block',
                fontWeight: 700,
                color: 'text.secondary',
                fontSize: '0.68rem',
                letterSpacing: 1,
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => handleNavigate(item.path)}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        px: 2,
                        bgcolor: isActive
                          ? isDark
                            ? 'rgba(13, 148, 136, 0.2)'
                            : 'rgba(13, 148, 136, 0.12)'
                          : 'transparent',
                        color: isActive ? 'primary.main' : 'text.primary',
                        fontWeight: isActive ? 700 : 500,
                        borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 36,
                          color: isActive ? 'primary.main' : 'text.secondary',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 700 : 500,
                        }}
                      />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          color={item.badge === 'AI' || item.badge === 'Gemini' ? 'primary' : 'secondary'}
                          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: isDark ? 'rgba(17, 28, 56, 0.6)' : 'rgba(241, 245, 249, 0.8)',
          border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: 'success.main',
            boxShadow: '0 0 10px #10B981',
          }}
        />
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
            Zoho Catalyst & Gemini
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
            System Operational
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Permanent Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            top: 64,
            height: 'calc(100vh - 64px)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
