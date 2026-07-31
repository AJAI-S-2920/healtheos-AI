import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Alert,
  Divider,
  MenuItem,
  useTheme,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SaveIcon from '@mui/icons-material/Save';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/common/GlassCard';

export const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [fullName, setFullName] = useState<string>(currentUser?.displayName || 'Alex Mercer');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [emergencyContact, setEmergencyContact] = useState<string>('+1 (555) 234-5678');
  const [preExistingConditions, setPreExistingConditions] = useState<string>('Mild Impaired Fasting Glucose, Vitamin D Deficiency');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account profile, personal health records metadata, and emergency contacts.
        </Typography>
      </Box>

      {savedSuccess && (
        <Alert severity="success" onClose={() => setSavedSuccess(false)} sx={{ mb: 3, borderRadius: 2 }}>
          Profile updated successfully.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left User Identity Card */}
        <Grid item xs={12} md={4}>
          <GlassCard sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Avatar
              sx={{
                width: 96,
                height: 96,
                bgcolor: 'primary.main',
                fontWeight: 800,
                fontSize: '2.5rem',
                mx: 'auto',
                mb: 2,
                border: '4px solid #14B8A6',
                boxShadow: '0 8px 24px rgba(13, 148, 136, 0.3)',
              }}
            >
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </Avatar>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {currentUser?.email}
            </Typography>

            <Chip
              icon={<VerifiedUserIcon sx={{ fontSize: '1rem !important' }} />}
              label={`ROLE: ${currentUser?.role?.toUpperCase() || 'PATIENT'}`}
              color="primary"
              sx={{ fontWeight: 800, mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Firebase User UID:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all', mb: 2 }}>
                {currentUser?.uid}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                Account Created:
              </Typography>
              <Typography variant="body2">
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active Session'}
              </Typography>
            </Box>
          </GlassCard>
        </Grid>

        {/* Right Form Card */}
        <Grid item xs={12} md={8}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Personal Health Details
            </Typography>

            <Box component="form" onSubmit={handleSave}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={currentUser?.email || ''}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Blood Group"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <MenuItem key={bg} value={bg}>
                        {bg}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact Phone"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Pre-existing Medical Conditions / Allergies"
                    value={preExistingConditions}
                    onChange={(e) => setPreExistingConditions(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                sx={{ mt: 4, py: 1.5, px: 4, fontWeight: 700 }}
              >
                Save Profile Changes
              </Button>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
