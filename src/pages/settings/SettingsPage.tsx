import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import SaveIcon from '@mui/icons-material/Save';
import { useThemeMode } from '../../context/ThemeModeContext';
import GlassCard from '../../components/common/GlassCard';

export const SettingsPage: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isDark = mode === 'dark';

  const [geminiApiKey, setGeminiApiKey] = useState<string>(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [catalystProjectId, setCatalystProjectId] = useState<string>(import.meta.env.VITE_CATALYST_PROJECT_ID || 'demo_catalyst_project');
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [saveAlert, setSaveAlert] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Settings & Environment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure application preferences, security integrations, and Zoho Catalyst & Gemini API credentials.
        </Typography>
      </Box>

      {saveAlert && (
        <Alert severity="success" onClose={() => setSaveAlert(false)} sx={{ mb: 3, borderRadius: 2 }}>
          Settings updated successfully.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Appearance & Interface */}
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <SettingsOutlinedIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Appearance & Theme
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <FormControlLabel
              control={<Switch checked={isDark} onChange={toggleTheme} color="primary" />}
              label={
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Enable Dark Mode ({isDark ? 'Dark Theme Active' : 'Light Theme Active'})
                </Typography>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Toggle between standard Light mode and high-contrast Slate Navy dark mode.
            </Typography>

            <FormControlLabel
              control={<Switch checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} color="primary" />}
              label={<Typography variant="body1" sx={{ fontWeight: 600 }}>Critical Biomarker Email Alerts</Typography>}
            />
          </GlassCard>
        </Grid>

        {/* API Credentials */}
        <Grid item xs={12} md={6}>
          <GlassCard sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <KeyOutlinedIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                API Credentials & Tokens
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSave}>
              <TextField
                fullWidth
                label="Google Gemini API Key"
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                helperText="Used for automated PDF summary generation & clinical chat assistant."
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Zoho Catalyst Project ID"
                value={catalystProjectId}
                onChange={(e) => setCatalystProjectId(e.target.value)}
                helperText="Zoho Catalyst Advanced I/O environment identifier."
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ py: 1.2, px: 3, fontWeight: 700 }}
              >
                Save Settings
              </Button>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
