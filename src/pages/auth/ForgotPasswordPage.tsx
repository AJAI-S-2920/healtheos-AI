import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../layouts/AuthLayout';
import { ForgotPasswordFormData } from '../../types/auth';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword, error, clearError } = useAuth();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    clearError();
    setSubmitting(true);
    try {
      await resetPassword(data.email);
      setSentSuccess(true);
    } catch (err) {
      // Error in auth context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your registered email address to receive password reset instructions"
    >
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {sentSuccess ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Reset Link Sent!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            We've sent a password recovery link to your email. Please check your inbox and follow the instructions.
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
            startIcon={<ArrowBackIcon />}
            sx={{ py: 1.5, fontWeight: 700 }}
          >
            Back to Sign In
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ py: 1.5, mt: 3, mb: 3, fontSize: '1rem', fontWeight: 700 }}
          >
            {submitting ? 'Sending Request...' : 'Send Reset Link'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              startIcon={<ArrowBackIcon fontSize="small" />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Return to Login
            </Button>
          </Box>
        </Box>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
