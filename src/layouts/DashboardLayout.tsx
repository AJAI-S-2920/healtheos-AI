import React, { useState } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleToggleSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header onToggleSidebar={handleToggleSidebar} />
      <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2.5, sm: 4 },
            minHeight: 'calc(100vh - 64px)',
            width: { md: `calc(100% - 260px)` },
            bgcolor: isDark ? '#0B132B' : '#F8FAFC',
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <Container maxWidth="xl" disableGutters>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
