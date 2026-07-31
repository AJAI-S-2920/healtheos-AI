import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Chip,
  Paper,
  Alert,
  useTheme,
} from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { motion } from 'framer-motion';

interface FileUploadZoneProps {
  onFileSelected: (file: File) => void;
  onUseSampleReport: () => void;
  isProcessing: boolean;
  progressStep: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelected,
  onUseSampleReport,
  isProcessing,
  progressStep,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndPassFile = (file: File) => {
    setErrorMsg(null);
    if (!file) return;

    // Check size limit (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('File size exceeds 15MB limit. Please upload a smaller report PDF.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPassFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndPassFile(e.target.files[0]);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {errorMsg && (
        <Alert severity="error" onClose={() => setErrorMsg(null)} sx={{ mb: 3, borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".pdf,.png,.jpg,.jpeg,.txt"
        style={{ display: 'none' }}
      />

      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          borderRadius: 4,
          cursor: isProcessing ? 'default' : 'pointer',
          border: '2px dashed',
          borderColor: isDragOver
            ? theme.palette.primary.main
            : isDark
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(0, 0, 0, 0.15)',
          bgcolor: isDragOver
            ? isDark
              ? 'rgba(13, 148, 136, 0.12)'
              : 'rgba(13, 148, 136, 0.06)'
            : isDark
            ? 'rgba(17, 28, 56, 0.5)'
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.25s ease-in-out',
          '&:hover': isProcessing
            ? {}
            : {
                borderColor: theme.palette.primary.main,
                bgcolor: isDark ? 'rgba(13, 148, 136, 0.08)' : 'rgba(13, 148, 136, 0.04)',
              },
        }}
      >
        {isProcessing ? (
          <Box sx={{ py: 3, maxWidth: 450, mx: 'auto' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', marginBottom: 16 }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </motion.div>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Processing Clinical Document
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {progressStep}
            </Typography>
            <LinearProgress color="primary" sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        ) : (
          <Box>
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: isDark ? 'rgba(13, 148, 136, 0.15)' : 'rgba(13, 148, 136, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: 'primary.main' }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Drag & Drop Medical Report PDF
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Upload lab test results, complete blood counts (CBC), metabolic panels, or lipid profiles (.PDF, .PNG, .JPG).
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<InsertDriveFileOutlinedIcon />}
                sx={{ py: 1.2, px: 3, fontWeight: 700 }}
              >
                Browse PDF File
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={onUseSampleReport}
                startIcon={<AutoAwesomeIcon />}
                sx={{ py: 1.2, px: 3, fontWeight: 700 }}
              >
                Load Demo Lab Report
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Chip label="PDF / Images up to 15MB" size="small" variant="outlined" />
              <Chip label="Zoho Catalyst File Store" size="small" variant="outlined" color="primary" />
              <Chip label="Automated Biomarker Extractor" size="small" variant="outlined" color="secondary" />
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FileUploadZone;
